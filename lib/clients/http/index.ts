import { DataType, DeleteRequestParams, GetRequestParams, Headers, Method, NormalizedRequest, PatchRequestParams, PostRequestParams, PutRequestParams, RequestParams } from "./types"
import fetch, { Headers as Header } from "node-fetch"

export class HttpClient {
  // 1 second
  static readonly RETRY_WAIT_TIME = 1000

  readonly hostname: string

  constructor(hostname: string) {
    this.hostname = hostname
  }

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

  protected async request<T = unknown>(params: RequestParams): Promise<T> {
    const maxTries = params.tries ? params.tries : 1
    if (maxTries <= 0) {
      throw new Error(
        `Number of tries must be >= 0, got ${maxTries}`,
      )
    }

    let headers: typeof params.extraHeaders = {
      ...params.extraHeaders,
    }
    let body
    if (params.method === Method.Post || params.method === Method.Put || params.method === Method.Patch) {
      const type = (params as PostRequestParams).type ?? DataType.JSON
      const data = (params as PostRequestParams).data
      if (data) {
        switch (type) {
          case DataType.JSON:
            body = typeof data === 'string' ? data : JSON.stringify(data)
            break
          case DataType.URLEncoded:
            body =
              typeof data === 'string'
                ? data
                : new URLSearchParams(
                  data as { [key: string]: string },
                ).toString()
            break
        }
        headers = {
          ...headers,
          'Content-Type': type!,
          'Content-Length': new TextEncoder().encode(body).length,
        }
      }
    }

    const url = `${params.hostname || this.hostname}${this.getRequestPath(params.path)}`
    const request: NormalizedRequest = {
      method: params.method,
      url,
      headers: headers as any,
      body,
    }

    async function sleep(waitTime: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    let tries = 0
    while (tries < maxTries) {
      try {
        return await this.doRequest<T>(request)
      } catch (error: any) {
        tries++
        if (tries < maxTries) {
          let waitTime = this.httpClass().RETRY_WAIT_TIME
          await sleep(waitTime)
          continue
        }

        // We're set to multiple tries but ran out
        if (maxTries > 1) {
          throw new Error(
            `Exceeded maximum retry count of ${maxTries}. Last message: ${error.message}`,
          )
        }

        // We're not retrying or the error is not retriable, rethrow
        throw error
      }
    }

    // We're never supposed to come this far, this is here only for the benefit of Typescript
    /* istanbul ignore next */
    throw new Error(
      `Unexpected flow, reached maximum HTTP tries but did not throw an error`,
    )
  }

  protected getRequestPath(path: string): string {
    return `/${path.replace(/^\//, '')}`
  }

  private httpClass() {
    return this.constructor as typeof HttpClient
  }

  private getHeader(headers: Headers) {
    const h = new Header()
    Object.keys(headers).forEach(k => {
      const value = Array.isArray(headers[k])
        ? (headers[k] as string[]).join(",")
        : headers[k] as string
      h.set(k, value)
    })

    return h
  }

  private async doRequest<T = unknown>(request: NormalizedRequest): Promise<T> {
    const headers = this.getHeader(request.headers)
    const response = await fetch(request.url, {
      ...request,
      headers
    })

    if(!response.ok) {
      throw new Error(`API Request fail`)
    }

    let body: { [key: string]: string } | string | T = {}
    let content = await response.text()
    if (content) {
      try {
        body = JSON.parse(content)
      } catch (error) {
        body = content
      }
    }

    return body as T
  }
}