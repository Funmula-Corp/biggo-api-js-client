import FormData from "form-data"

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