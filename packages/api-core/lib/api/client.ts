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

  /**
   * returns the request path for HTTP requests by combining the base path, the scope and an optional ID parameter.
   */
  protected getRequestPath(id?: string) {
    return this.httpClass().PATH + this.fixRequestPath(this.scope) + `/${id || ""}`
  }

  /**
   * fixes the format of the request path by adding the leading forward slash (/).
   */
  protected fixRequestPath(path: string): string {
    return `/${path.replace(/^\//, '')}`
  }

  /**
   * checks the response returned from an API call against the expected HTTP response codes (200/201). If the response is successful it returns true, otherwise it throws an error
   */
  protected resolveBaseResponse(res: RequestReturn<BaseResponse>): boolean {
    return this.resolveResponse(res).result
  }

  /**
   * resolves the response of an HTTP request and returns the body of the response.
   */
  protected resolveResponse<T = unknown>(res: RequestReturn<T>): T {
    return res.body
  }

  /**
   * returns the current instance of APIClient.
   */
  private httpClass() {
    return this.constructor as typeof APIClient
  }
}
