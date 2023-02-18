import { HttpClient } from "../../clients/http"
import { DataType, Method, PostRequestParams, RequestParams } from "../../clients/http/types"
import { BIGGO_AUTH_JWT_ENDPOINT } from "./endpoint"
import type { BigGoJWTClientInitialParams, JWTAuthResponse } from "./types"

export class BigGoJWTClient extends HttpClient {
  #apiKey: string
  #apiSecretKey: string

  #token: string = ""
  #tokenType: string = "Bearer"
  #tokenExpires: number = 0

  constructor({ apiKey, apiSecretKey }: BigGoJWTClientInitialParams) {
    super(process.env.API_DOMAIN!)
    this.#apiKey = apiKey
    this.#apiSecretKey = apiSecretKey
  }

  public apiKey(apiKey: string): this {
    this.#apiKey = apiKey
    return this
  }

  public apiSecretKey(apiSecretKey: string): this {
    this.#apiSecretKey = apiSecretKey
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
    const auth = Buffer.from(`${this.#apiKey}:${this.#apiSecretKey}`).toString('base64')
    const params: PostRequestParams = {
      data: { grant_type: "client_credentials" },
      hostname: process.env.API_AUTH_DOMAIN,
      path: BIGGO_AUTH_JWT_ENDPOINT,
      type: DataType.URLEncoded,
      extraHeaders: {
        Authorization: `Basic ${auth}`
      }
    }

    const response = await super.request<JWTAuthResponse>({ method: Method.Post, ...params })
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

  protected async request<T = unknown>(params: RequestParams): Promise<T> {
    if (!params.extraHeaders) {
      params.extraHeaders = {}
    }

    params.extraHeaders["Authorization"] = `${this.getTokenType()} ${await this.getToken()}`
    return super.request<T>(params)
  }
}