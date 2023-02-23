import fetch, { Headers } from "node-fetch"
import FormData from "form-data"
import { BigGoAPIError } from "@funmula/api-core/lib/error"
import ProcessedQuery from "../util/processed-query"
import { AbstractHttpClient } from "@funmula/api-core/lib/http"
import { DataType, Method } from "@funmula/api-core/lib/http/types"

import type { ErrorResponse, NormalizedRequest, PostRequestParams, RequestParams, RequestReturn } from "@funmula/api-core/lib/http/types"

export class HttpClient extends AbstractHttpClient {
  readonly hostname: string

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

            const form = new FormData()
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
    const h = new Headers()
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
    const response = await fetch(request.url, {
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

    if ("error" in (body as any)) {
      throw new BigGoAPIError(body as ErrorResponse)
    } else if (!response.ok) {
      throw new Error("BigGo API Error")
    }

    return {
      body: body as T,
      headers: response.headers.raw()
    }
  }
}