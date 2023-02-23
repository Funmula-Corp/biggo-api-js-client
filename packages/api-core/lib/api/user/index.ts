import { APIClient } from "../client"
import { APIClientRequired } from "../../types"
import { UserLikeVideoResponse, UserSelfResponse, UserVideo } from "./types"

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
    return this.getUserVideos("user_video")
  }

  public async getLikeVideos(): Promise<UserVideo[]> {
    return this.getUserVideos("like_video")
  }

  private async getUserVideos(tab: string, p: number = 1): Promise<UserVideo[]> {
    const { body } = await this.client.get<UserLikeVideoResponse>({
      path: this.getRequestPath("self/video"),
      query: { tab, p }
    })

    const { result, ...data } = body
    return data.user_video.data || []
  }
}