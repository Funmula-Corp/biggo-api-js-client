import { APIClient } from "../client"
import { APIClientRequired } from "../types"
import { UserLikeVideoResponse, UserSelfResponse, UserSubscribe, UserSubscribeResponse, UserVideo, UserVideoResponse } from "./types"

export class APIUserClient extends APIClient {
  constructor(params: APIClientRequired) {
    super({
      ...params,
      scope: "user",
    })
  }

  public async get(): Promise<Omit<UserSelfResponse, "result">> {
    const { body } = await this.client.get<UserSelfResponse>({
      path: this.getRequestPath("self/video")
    })

    const { result, ...data } = body
    return data
  }

  public async getVideos(): Promise<UserVideo[]> {
    const { body } = await this.client.get<UserVideoResponse>({
      path: this.getRequestPath("self/video"),
      query: {
        tab: "user_video",
        p: 1
      }
    })

    const { result, ...data } = body
    return data.user_video.data || []
  }

  public async getLikeVideos(): Promise<UserVideo[]> {
    const { body } = await this.client.get<UserLikeVideoResponse>({
      path: this.getRequestPath("self/video"),
      query: {
        tab: "like_video",
        p: 1
      }
    })

    const { result, ...data } = body
    return data.like_video.data || []
  }

  public async getSubscribeProducts(): Promise<UserSubscribe[]> {
    const { body } = await this.client.get<UserSubscribeResponse>({
      path: this.getRequestPath("self/video"),
      query: {
        tab: "subscribe_product",
        p: 1
      }
    })

    const { result, ...data } = body
    return data.subscribe_product.data || []
  }
}