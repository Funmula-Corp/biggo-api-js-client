import { BaseResponse } from "../../http/types"
import { BigGoVideo, VideoUserInfo } from "./struct"

export enum VideoProcessStatus {
  IN_QUEUE = 1,
  COMPLETE = 13
}

export enum VideoVisibility {
  Public = 0,
  Private = 1,
  Unlisted = 2,
}

export type VideoUpdateParams = {
  title?: string
  description?: string
  access?: VideoVisibility | "public" | "private" | "unlisted"
  products?: {
    nindex: string
    oid: string
  }[]

  /** thumbnail screenshot time(ms) */
  thumbnailTime ?: number
}

export type VideoUploadParams = Required<Omit<VideoUpdateParams, "products" | "thumbnailTime">> & Partial<Pick<VideoUpdateParams, "products" | "thumbnailTime">> & {
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
  result: true
  video_id: string
}