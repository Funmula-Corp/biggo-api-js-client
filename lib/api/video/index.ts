import { DataType } from "../../clients/http/types"
import { APIClient } from "../client"
import fs from "node:fs"
import type { APIClientRequired, BaseResponse } from "../types"
import type { VideoUpdateParams, VideoResponse, VideoUploadParams, VideoUploadResponse } from "./types"

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
    const { video } = await this.client.get<VideoResponse>({
      path: this.getRequestPath(id)
    })

    return video.length ? video[0] : undefined
  }

  /**
   * Update video properties
   */
  async update(id: string, params: VideoUpdateParams) {
    return this.resolveBaseResponse(
      await this.client.patch<BaseResponse>({
        path: this.getRequestPath(id),
        data: this.mappingEditFields(params),
        type: DataType.JSON
      })
    )
  }

  /**
   * Delete the video if the api token owner owns it
   */
  async delete(id: string) {
    return this.resolveBaseResponse(
      await this.client.delete<BaseResponse>({
        path: this.getRequestPath(id)
      })
    )
  }

  /**
   * Upload the new video to token owner account
   */
  async upload({ file, ...params }: VideoUploadParams) {
    // upload video
    const { result, ...body } = await this.client.post<VideoUploadResponse>({
      path: this.getRequestPath(),
      type: DataType.MultipartFormData,
      data: { file: fs.createReadStream(file) },
      extraHeaders: {
        "File-Size": fs.statSync(file).size,
        "X-Bgo-Thumbnail-TS": params.thumbnailTime || 0,
      },
    })

    if(!result) {
      throw new Error("video upload fail.")
    }

    // edit video data
    const res = await this.client.post<BaseResponse>({
      path: this.getRequestPath(body.video_id),
      data: this.mappingEditFields(params)
    })

    if(!res) {
      throw new Error("video upload fail.")
    }

    return body.video_id
  }

  private mappingEditFields(params: VideoUpdateParams) {
    return {
      ...params,
      product_list: params.products,
      "thumbnail-ts": params.thumbnailTime
    }
  }
}