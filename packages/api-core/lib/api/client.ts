import { RESTClient } from "../http/types"
import { RequestReturn, BaseResponse } from "../http/types"
import type { APIClientConfiguration } from "../types"

export class APIClient {
  static readonly PATH = "/api/v1"

  readonly client: RESTClient
  readonly scope: string

  constructor(param: APIClientConfiguration) {
    this.client = param.client
    this.scope = Array.isArray(param.scope) ? param.scope.join("/") : param.scope
  }

  protected getRequestPath(id?: string) {
    return this.httpClass().PATH + this.fixRequestPath(this.scope) + `/${id || ""}`
  }

  protected fixRequestPath(path: string): string {
    return `/${path.replace(/^\//, '')}`
  }

  protected resolveBaseResponse(res: RequestReturn<BaseResponse>): boolean {
    return this.resolveResponse(res).result
  }

  protected resolveResponse<T = unknown>(res: RequestReturn<T>): T {
    return res.body
  }

  private httpClass() {
    return this.constructor as typeof APIClient
  }
}
