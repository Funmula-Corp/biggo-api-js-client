import { BaseResponse, DataType } from "../../http/types"
import { APIClient } from "../client"
import fs from "node:fs"
import { BigGoVideo } from "./struct"
import { BigGoAPIError, BigGoAPIErrorEnum } from "../../error"
import { devWarn } from "../../util/logger"
import type { APIClientRequired } from "../../types"
import type { VideoUpdateParams, VideoResponse, VideoUploadParams, VideoUploadResponse } from "./types"


export class APIVideoClient extends APIClient {
  static readonly VIDEO_PRODUCT_LIMIT = 10

  constructor(params: APIClientRequired) {
    super({
      ...params,
      scope: "video",
    })
  }

  /**
   * Wrap get video with error handle
   */
  public async get(id: string): Promise<BigGoVideo|undefined> {
    return this._get(id).catch(this.errorHandle)
  }

  /**
   * Get video info with video id
   */
  private async _get(id: string): Promise<BigGoVideo|undefined> {
    const { body: { video } } = await this.client.get<VideoResponse>({
      path: this.getRequestPath(id)
    })

    return video.length ? video[0] : undefined
  }

  public async update(id: string, params: VideoUpdateParams): Promise<boolean|undefined> {
    return this._update(id, params).catch(this.errorHandle)
  }

  /**
   * Update video properties
   */
  private async _update(id: string, params: VideoUpdateParams): Promise<boolean> {
    return this.resolveBaseResponse(
      await this.client.patch<BaseResponse>({
        path: this.getRequestPath(id),
        data: this.mappingEditFields(params),
        type: DataType.JSON
      })
    )
  }

  public async delete(id: string): Promise<boolean|undefined> {
    return this._delete(id).catch(this.errorHandle)
  }

  /**
   * Delete the video if the api token owner owns it
   */
  private async _delete(id: string): Promise<boolean> {
    return this.resolveBaseResponse(
      await this.client.delete<BaseResponse>({
        path: this.getRequestPath(id)
      })
    )
  }

  private async uploadFile(file: string, thumbnailTime: number = 0): Promise<string|undefined> {
    return await this.client.post<VideoUploadResponse>({
      path: this.getRequestPath(),
      type: DataType.MultipartFormData,
      data: { file: fs.createReadStream(file) },
      extraHeaders: {
        "File-Size": fs.statSync(file).size,
        "X-Bgo-Thumbnail-TS": thumbnailTime,
      },
    })
    .then(({ body }) => body.video_id)
    .catch(error => {
      if(!(error instanceof BigGoAPIError)) {
        throw error
      }

      switch(error.code) {
        case BigGoAPIErrorEnum.VIDEO_UPLOAD_VIDEO_EXIST:
          throw error
        case BigGoAPIErrorEnum.VIDEO_UPLOAD_TRANSCODE_ERROR:
          devWarn("video transcode error")
          break
      }

      return undefined
    })
  }

  private async updateUploadedFile(id: string, params: VideoUpdateParams): Promise<boolean> {
    return this.resolveBaseResponse(
      await this.client.post<BaseResponse>({
        path: this.getRequestPath(id),
        data: this.mappingEditFields(params)
      })
    )
  }

  /**
   * Upload the new video to token owner account
   */
  public async upload({ file, ...params }: VideoUploadParams): Promise<string|undefined> {
    const videoId = await this.uploadFile(file, params.thumbnailTime)
    if(!videoId) {
      return undefined
    }

    const editRes = await this.updateUploadedFile(videoId, params).catch(this.errorHandle)
    if(!editRes) {
      await this.delete(videoId)
      return undefined
    }

    return videoId
  }

  private mappingEditFields(params: VideoUpdateParams) {
    if(params.products && params.products?.length > APIVideoClient.VIDEO_PRODUCT_LIMIT) {
      devWarn("The product list includes over 10 items.")
    }

    const { title, description, access } = params
    return {
      title, description, access,
      product_list: params.products?.splice(0, APIVideoClient.VIDEO_PRODUCT_LIMIT),
      thumbnail_time: params.thumbnailTime,
    }
  }

  private errorHandle(error: unknown): undefined {
    if(!(error instanceof BigGoAPIError)) {
      throw error
    }

    switch(error.code) {
      case BigGoAPIErrorEnum.VIDEO_DIFFERENT_USER:
        devWarn(`different user. code ${error.code}`)
        break
      case BigGoAPIErrorEnum.VIDEO_DELETED:
        devWarn(`video deleted. code ${error.code}`)
        break
      case BigGoAPIErrorEnum.VIDEO_NOT_EXIST:
        devWarn(`video not exist. code ${error.code}`)
        break
      case BigGoAPIErrorEnum.VIDEO_PARAMETER_INVALID:
        devWarn(`video parameter invalid. code ${error.code}`)
        break
      case BigGoAPIErrorEnum.VIDEO_UPLOAD_PRODUCT_IS_NOT_EXIST:
        devWarn(`Product is not exist. code ${error.code}`)
        break
      case BigGoAPIErrorEnum.VIDEO_UPLOAD_PRODUCT_LIST_OVER_LIMIT:
        devWarn(`The product list includes over 10 items. code ${error.code}`)
        break
    }

    return undefined
  }
}