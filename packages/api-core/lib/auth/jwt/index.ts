import { HttpClient } from "../../http"
import { DataType, Method, PostRequestParams, RequestParams, RequestReturn } from "../../http/types"
import { BigGoAPIError, BigGoAPIErrorEnum } from "../../error"
import { BIGGO_AUTH_JWT_ENDPOINT } from "./endpoint"
import type { BigGoJWTClientInitialParams, JWTAuthResponse } from "./types"

export class BigGoJWTClient extends HttpClient {
  #clientId: string
  #clientSecret: string

  #token: string = ""
  #tokenType: string = "Bearer"
  #tokenExpires: number = 0

  #authHostname: string

  constructor({ client_id, client_secret, ...param }: BigGoJWTClientInitialParams) {
    super(param.hostname)
    this.#authHostname = param.authHostname
    this.#clientId = client_id
    this.#clientSecret = client_secret
  }

  public apiKey(apiKey: string): this {
    this.#clientId = apiKey
    return this
  }

  public apiSecretKey(apiSecretKey: string): this {
    this.#clientSecret = apiSecretKey
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

  protected async auth() {
    const auth = Buffer.from(`${this.#clientId}:${this.#clientSecret}`).toString('base64')
    const params: PostRequestParams = {
      data: { grant_type: "client_credentials" },
      hostname: this.#authHostname,
      path: BIGGO_AUTH_JWT_ENDPOINT,
      type: DataType.URLEncoded,
      extraHeaders: {
        Authorization: `Basic ${auth}`
      }
    }

    const { body: response } = await super.request<JWTAuthResponse>({ method: Method.Post, ...params })
    if ("error" in response) {
      throw new Error(response.error === "invalid_request" ? "invalid credential" : response.error)
    }

    this.#token = response.access_token
    this.#tokenType = response.token_type
    this.#tokenExpires = response.expires_in + (Date.now() / 1000)
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
      return await super.request<T>(params)
    } catch(error: any) {
      if(!(error instanceof BigGoAPIError)) {
        throw error
      }

      switch((error as BigGoAPIError).code) {
        case BigGoAPIErrorEnum.JWT_EXPIRED:
          await this.renew()
          return super.request<T>(params)
        case BigGoAPIErrorEnum.JWT_INVALID:
          throw new Error("BigGo JWT Client error: invalid client credential")
      }

      throw error
    }
  }
}
