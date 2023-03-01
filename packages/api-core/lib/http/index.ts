import { BigGoAPIError } from "../error"
import ProcessedQuery from "../util/processed-query"
import { DataType, DeleteRequestParams, ErrorResponse, GetRequestParams, Method, NormalizedRequest, PatchRequestParams, PostRequestParams, PutRequestParams, RequestParams, RequestReturn, RESTClient } from "./types"

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
    throw new Error("AbstractHttpClient must be implemented")
  }
}

export class HttpClient extends AbstractHttpClient {
  readonly hostname: string
  readonly fetch: typeof fetch = globalThis.fetch
  readonly Headers: typeof Headers = globalThis.Headers
  readonly FormData: typeof FormData = globalThis.FormData

  constructor(hostname: string) {
    super()
    this.hostname = hostname
  }

  protected async request<T = unknown>(params: RequestParams): Promise<RequestReturn<T>> {
    let headers: typeof params.extraHeaders = { ...params.extraHeaders }
    let body
    if (params.method === Method.Post || params.method === Method.Put || params.method === Method.Patch) {
      const type = (params as PostRequestParams).type ?? DataType.JSON
      const data = (params as PostRequestParams).data
      if (data) {
        switch (type) {
          case DataType.JSON:
            body = typeof data === "string" ? data : JSON.stringify(data)
            break
          case DataType.URLEncoded:
            body =
              typeof data === "string"
                ? data
                : new URLSearchParams(
                  data as { [key: string]: string },
                ).toString()
            break
          case DataType.MultipartFormData:
            if(typeof data === "string") {
              body = data
              break
            }

            const form = new this.FormData()
            for (const key in data) {
              form.append(key, data[key] as string)
            }

            body = form as unknown as globalThis.FormData
            break
        }
        headers = {
          ...headers,
        }

        if(type !== DataType.MultipartFormData) {
          headers["Content-Type"] = type!
        }
      }
    }

    const url = `${params.hostname || this.hostname}${this.getRequestPath(params.path)}${ProcessedQuery.stringify(params.query||{})}`
    const request: NormalizedRequest = {
      method: params.method,
      url,
      headers: headers as any,
      body,
    }

    return await this.doRequest<T>(request)
  }

  protected getRequestPath(path: string): string {
    return `/${path.replace(/^\//, "")}`
  }

  private getHeader(headers: Record<string, string|string[]>) {
    const h = new this.Headers()
    Object.keys(headers).forEach(k => {
      const value = Array.isArray(headers[k])
        ? (headers[k] as string[]).join(",")
        : headers[k] as string
      h.set(k, value)
    })

    return h
  }

  private async doRequest<T = unknown>(request: NormalizedRequest): Promise<RequestReturn<T>> {
    const headers = this.getHeader(request.headers)
    const response = await this.fetch(request.url, {
      ...request,
      body: request.body as string,
      headers
    })

    let body: { [key: string]: string } | string | T = {}
    let content = await response.text()
    if (content) {
      try {
        body = JSON.parse(content)
      } catch (error) {
        body = content
      }
    }

    if (typeof body === "object" && "error" in (body as any)) {
      throw new BigGoAPIError(body as ErrorResponse)
    } else if (!response.ok) {
      throw new Error("BigGo API Error")
    }

    return {
      body: body as T,
      headers: Object.fromEntries(response.headers.entries())
    }
  }
}