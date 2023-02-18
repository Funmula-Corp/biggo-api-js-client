import { BaseResponse } from "../types"
import { BigGoVideo, VideoUserInfo } from "./struct"

export enum VideoProcessStatus {
  IN_QUEUE = 1,
  COMPLETE = 13
}

export enum VideoPermission {
  Everyone = "everyone",
  Myself = "limit_myself",
  Private = "non_public",
}

export type VideoUpdateParams = {
  description?: string
  limit?: VideoPermission
  product_list?: {
    nindex: string,
    oid: string,
  }[]

  /** thumbnail screenshot time(ms) */
  "thumbnail-ts"?: number
}

export type VideoResponse = BaseResponse & {
  result: true
  user: VideoUserInfo
  video: BigGoVideo[]
  size: number
}
