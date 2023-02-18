import { DataType } from "../../clients/http/types"
import { APIClient } from "../client"
import type { APIClientRequired, BaseResponse } from "../types"
import type { VideoUpdateParams, VideoResponse } from "./types"

export class APIVideoClient extends APIClient {
  constructor(params: APIClientRequired) {
    super({
      ...params,
      scope: "video",
    })
  }

  /**
   * Get video info with video id
   */
  async get(id: string) {
    return this.client.get<VideoResponse>({
      path: this.getRequestPath(id)
    })
  }

  /**
   * Update video properties
   */
  async update(id: string, params: VideoUpdateParams) {
    return this.client.patch<BaseResponse>({
      path: this.getRequestPath(id),
      data: params,
      type: DataType.JSON
    })
  }

  /**
   * Delete the video if the api token owner owns it
   */
  async delete(id: string) {
    return this.client.delete<BaseResponse>({
      path: this.getRequestPath(id)
    })
  }
}