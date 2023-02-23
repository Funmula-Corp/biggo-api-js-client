import { DeleteRequestParams, GetRequestParams, Method, PatchRequestParams, PostRequestParams, PutRequestParams, RequestParams, RequestReturn, RESTClient } from "./types"

export type { RESTClient }

export class AbstractHttpClient implements RESTClient {
  /**
   * Performs a GET request on the given path.
   */
  public async get<T = unknown>(params: GetRequestParams) {
    return this.request<T>({ method: Method.Get, ...params })
  }

  /**
   * Performs a POST request on the given path.
   */
  public async post<T = unknown>(params: PostRequestParams) {
    return this.request<T>({ method: Method.Post, ...params })
  }

  /**
   * Performs a PUT request on the given path.
   */
  public async put<T = unknown>(params: PutRequestParams) {
    return this.request<T>({ method: Method.Put, ...params })
  }

  /**
   * Performs a PATCH request on the given path.
   */
  public async patch<T = unknown>(params: PatchRequestParams) {
    return this.request<T>({ method: Method.Patch, ...params })
  }

  /**
   * Performs a DELETE request on the given path.
   */
  public async delete<T = unknown>(params: DeleteRequestParams) {
    return this.request<T>({ method: Method.Delete, ...params })
  }

  protected async request<T = unknown>(params: RequestParams): Promise<RequestReturn<T>> {
    throw new Error("AbstractHttpClient need implement")
  }
}