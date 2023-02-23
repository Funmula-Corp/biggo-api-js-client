import { BaseResponse } from "../../clients/http/types"
import { BigGoVideo, VideoUserInfo } from "./struct"

export enum VideoProcessStatus {
  IN_QUEUE = 1,
  COMPLETE = 13
}

export enum VideoVisibility {
  Everyone = "everyone",
  Myself = "limit_myself",
  NonPublic = "non_public",
}

export type VideoUpdateParams = {
  title?: string
  description?: string
  limit?: VideoVisibility | "everyone" | "limit_myself" | "non_public"
  products?: {
    nindex: string,
    oid: string,
  }[]

  /** thumbnail screenshot time(ms) */
  thumbnailTime ?: number
}

export type VideoUploadParams = Pick<Required<VideoUpdateParams>, "products" | "thumbnailTime"> & {
  file: string
}

export type VideoResponse = BaseResponse & {
  result: true
  user: VideoUserInfo
  video: BigGoVideo[]
  size: number
}

export type AVideoInfo = BigGoVideo & {
  user: VideoUserInfo
}

export type VideoUploadResponse = BaseResponse & {
  result: true,
  video_id: string
}