import { HttpClient } from "../../http"
import { DataType, ErrorResponse, Method, PostRequestParams, RequestParams, RequestReturn } from "../../http/types"
import { BigGoAPIError, BigGoAPIErrorEnum, BigGoAuthErrorEnum } from "../../error"
import { BIGGO_AUTH_JWT_ENDPOINT } from "./endpoint"
import type { BigGoJWTClientInitialParams, JWTAuthResponse } from "./types"

export class BigGoJWTClient extends HttpClient {
  #clientId: string
  #clientSecret: string

  #token: string = ""
  #tokenType: string = "Bearer"
  #tokenExpires: number = 0

  #authHostname: string

  #errorRetry: number = 0
  static RETRY_LIMIT = 3

  #onTokenUpdate: (token: string) => void = () => {}
  #onAuthenticationError?: (error: BigGoAPIError<BigGoAuthErrorEnum>) => void

  constructor({ client_id, client_secret, ...param }: BigGoJWTClientInitialParams) {
    super(param.hostname)
    this.#authHostname = param.authHostname
    this.#clientId = client_id
    this.#clientSecret = client_secret
  }

  public onTokenUpdate(f: (token: string) => void): this {
    this.#onTokenUpdate = f
    return this
  }

  public onAuthenticationError(f: (error: BigGoAPIError<BigGoAuthErrorEnum>) => void): this {
    this.#onAuthenticationError = f
    return this
  }

  public clientId(clientId: string): this {
    this.#clientId = clientId
    return this
  }

  public clientSecret(clientSecret: string): this {
    this.#clientSecret = clientSecret
    return this
  }

  public token(t: string): this {
    this.#token = t
    return this
  }

  public isExpired() {
    return !this.#tokenExpires || (Date.now() / 1000) > this.#tokenExpires
  }

  public async getToken() {
    if(this.isExpired()) {
      await this.renew()
    }

    return this.#token
  }

  public getTokenType() {
    return this.#tokenType === "bearer" ? "Bearer" : this.#tokenType
  }

  protected async auth(param: Record<string, string>={}) {
    const params: PostRequestParams = {
      data: { grant_type: "client_credentials", ...param },
      hostname: this.#authHostname,
      path: BIGGO_AUTH_JWT_ENDPOINT,
      type: DataType.URLEncoded,
      extraHeaders: {
        Authorization: this.getAuthHeader()
      }
    }

    const { body: response } = await super.request<JWTAuthResponse>({ method: Method.Post, ...params })
    if ("error" in response) {
      if(typeof response.error === "object" && "code" in response.error && "message" in response.error) {
        const error = new BigGoAPIError(response as unknown as ErrorResponse<BigGoAuthErrorEnum>)
        if(this.#onAuthenticationError) {
          return this.#onAuthenticationError?.(error)
        }

        throw error
      }

      throw new Error(response.error === "invalid_request" ? "BigGo verify error: invalid credential" : response.error)
    }

    this.#token = response.access_token
    this.#tokenType = response.token_type
    this.#tokenExpires = response.expires_in + (Date.now() / 1000)
    this.#onTokenUpdate(this.#token)
  }

  protected getAuthHeader() {
    const auth = Buffer.from(`${this.#clientId}:${this.#clientSecret}`).toString("base64")
    return `Basic ${auth}`
  }

  protected async renew() {
    this.#token = ""
    this.#tokenType = "Bearer"
    this.#tokenExpires = 0
    return this.auth()
  }

  protected async request<T = unknown>(params: RequestParams): Promise<RequestReturn<T>> {
    if (!params.extraHeaders) {
      params.extraHeaders = {}
    }

    params.extraHeaders["Authorization"] = `${this.getTokenType()} ${await this.getToken()}`

    try {
      const response = await super.request<T>(params)
      this.#errorRetry = 0
      return response
    } catch(error: any) {
      if(!(error instanceof BigGoAPIError)) {
        throw error
      }

      const getGeneralError = () => new Error(`BigGo JWT Client error: ${error.message}`)
      switch((error as BigGoAPIError<BigGoAPIErrorEnum>).code) {
        // jwt token expired
        case BigGoAPIErrorEnum.JWT_EXPIRED:
          if(this.#errorRetry >= BigGoJWTClient.RETRY_LIMIT) {
            throw getGeneralError()
          }

          await this.renew()
          this.#errorRetry++
          return super.request<T>(params)

        // jwt token is invalid
        case BigGoAPIErrorEnum.JWT_INVALID:
          throw getGeneralError()
      }

      throw error
    }
  }
}
