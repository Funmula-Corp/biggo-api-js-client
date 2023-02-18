import { BaseResponse } from "../types"
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
  description?: string
  limit?: VideoVisibility
  products?: {
    nindex: string,
    oid: string,
  }[]

  /** thumbnail screenshot time(ms) */
  thumbnailTime ?: number
}

export type VideoUploadParams = Required<VideoUpdateParams> & {
  file: string
}

export type VideoResponse = BaseResponse & {
  result: true
  user: VideoUserInfo
  video: BigGoVideo[]
  size: number
}

export type VideoUploadResponse = BaseResponse & {
  result: true,
  video_id: string
}