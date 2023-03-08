import { BigGoAPIErrorEnum } from "../error"
import { BigGoUnionErrorEnum } from "../error/types"

export enum Method {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE"
}

export interface HeaderParams {
  [key: string]: string | number | string[]
}

export enum DataType {
  JSON = "application/json",
  URLEncoded = "application/x-www-form-urlencoded",
  MultipartFormData = "multipart/form-data"
}

export type QueryParams =
  | string
  | number
  | string[]
  | number[]
  | { [key: string]: QueryParams }

export interface GetRequestParams {
  path: string
  hostname?: string
  type?: DataType
  data?: { [key: string]: unknown } | string
  query?: { [key: string]: QueryParams }
  extraHeaders?: HeaderParams
  tries?: number
}

export type PostRequestParams = GetRequestParams & {
  data: { [key: string]: unknown } | string
}

export type PatchRequestParams = PostRequestParams

export type PutRequestParams = PostRequestParams

export type DeleteRequestParams = GetRequestParams

export type RequestParams = (GetRequestParams | PostRequestParams) & {
  method: Method
}

export interface Headers {
  [key: string]: string | string[]
}

export interface NormalizedRequest {
  method: string
  url: string
  headers: Headers
  body?: string | FormData
}

export type ErrorResponse<E extends BigGoUnionErrorEnum> = {
  result: false
  error: {
    code: E,
    message: string
  }
}

export type BaseResponse = { result: true } | ErrorResponse<BigGoAPIErrorEnum>

export interface RequestReturn<T = unknown> {
  body: T
  headers: Headers
}

export interface RESTClient {
  get<T = unknown>(params: GetRequestParams): Promise<RequestReturn<T>>
  post<T = unknown>(params: PostRequestParams): Promise<RequestReturn<T>>
  put<T = unknown>(params: PutRequestParams): Promise<RequestReturn<T>>
  patch<T = unknown>(params: PatchRequestParams): Promise<RequestReturn<T>>
  delete<T = unknown>(params: DeleteRequestParams): Promise<RequestReturn<T>>
}