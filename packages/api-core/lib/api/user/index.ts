import { APIClient } from "../client"
import { APIClientRequired } from "../../types"
import { UserLikeVideoResponse, UserSelfResponse, VideosWrap } from "./types"
import { APICollect } from "./collect"

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

  public async getVideos(p: number = 1): Promise<VideosWrap> {
    return this.getUserVideos("user_video", p)
  }

  public getVideosCollect() {
    return new APICollect({
      dataGetter: (p: number) => this.getVideos(p)
    })
  }

  public async getLikeVideos(p: number = 1): Promise<VideosWrap> {
    return this.getUserVideos("like_video", p)
  }

  public getLikeVideosCollect() {
    return new APICollect({
      dataGetter: (p: number) => this.getLikeVideos(p),
    })
  }

  private async getUserVideos(tab: string, p: number = 1): Promise<VideosWrap> {
    const { body } = await this.client.get<UserLikeVideoResponse>({
      path: this.getRequestPath("self/video"),
      query: { tab, p }
    })

    const { result, ...data } = body
    return data.user_video
  }
}