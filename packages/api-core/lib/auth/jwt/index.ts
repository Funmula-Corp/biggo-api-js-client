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

  /**
   * a function to be called when the token is updated. The provided function will receive the new token as an argument.
   */
  public onTokenUpdate(f: (token: string) => void): this {
    this.#onTokenUpdate = f
    return this
  }

  /**
   * a function to be called when there is an authentication error. The provided function will receive the BigGoAPIError as an argument.
   */
  public onAuthenticationError(f: (error: BigGoAPIError<BigGoAuthErrorEnum>) => void): this {
    this.#onAuthenticationError = f
    return this
  }

  /**
   * the client id for authentication. It returns the instance of the class itself, to allow method chaining.
   */
  public clientId(clientId: string): this {
    this.#clientId = clientId
    return this
  }

  /**
   * ets the client secret for authentication. It returns the instance of the class itself, to allow method chaining.
   */
  public clientSecret(clientSecret: string): this {
    this.#clientSecret = clientSecret
    return this
  }

  /**
   * sets the current token for the class. It returns the instance of the class itself, to allow method chaining.
   */
  public token(t: string): this {
    this.#token = t
    return this
  }

  /**
   * checks whether the current token is expired or not. It returns a boolean value.
   */
  public isExpired() {
    return !this.#tokenExpires || (Date.now() / 1000) > this.#tokenExpires
  }

  /**
   * retrieves the token for authentication. If the token has expired, it calls the renew() method to obtain a new one. It returns the current valid token.
   */
  public async getToken() {
    if(this.isExpired()) {
      await this.renew()
    }

    return this.#token
  }

  /**
   * retrieves the type of token currently stored in the instance. It returns the token type as a string
   */
  public getTokenType() {
    return this.#tokenType === "bearer" ? "Bearer" : this.#tokenType
  }

  /**
   * This method sends an authentication request to obtain
   * JWT token from BigGo OAuth 2.0 server using client id
   * and secret. If an error occurred during the request,
   * it will throw an error, otherwise it will save the token,
   * token type, and expiry time for later use.
   */
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

  /**
   * Get HTTP Authorization header with client ID and secret.
   */
  protected getAuthHeader() {
    const auth = Buffer.from(`${this.#clientId}:${this.#clientSecret}`).toString("base64")
    return `Basic ${auth}`
  }

  /**
   * Renew the JWT token.
   */
  protected async renew() {
    this.#token = ""
    this.#tokenType = "Bearer"
    this.#tokenExpires = 0
    return this.auth()
  }

  /**
   * Handle HTTP Requests. It builds headers, request bodies, and sends requests via fetch API under the hood. 
   * It throws BigGoAPIError when it catches errors from the API, otherwise, it returns the response as an object containing the body and headers.
   */
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

      const getGeneralError = (code: string) => new Error(`BigGo JWT Client error: ${error.message} code ${code}`)
      switch((error as BigGoAPIError<BigGoAPIErrorEnum>).code) {
        // jwt token expired
        case BigGoAPIErrorEnum.JWT_EXPIRED:
          if(this.#errorRetry >= BigGoJWTClient.RETRY_LIMIT) {
            throw getGeneralError(error.code)
          }

          await this.renew()
          this.#errorRetry++
          return super.request<T>(params)

        // jwt token is invalid
        case BigGoAPIErrorEnum.JWT_INVALID:
          throw getGeneralError(error.code)
      }

      throw error
    }
  }
}
