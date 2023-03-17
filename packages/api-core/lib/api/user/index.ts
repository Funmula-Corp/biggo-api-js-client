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

  /**
   * Gets information about the authenticated user, excluding the result field.
   */
  public async get(): Promise<Omit<UserSelfResponse, "result">> {
    const { body } = await this.client.get<UserSelfResponse>({
      path: this.getRequestPath("self/video")
    })

    const { result, ...data } = body
    return data
  }

  /**
   * Gets videos for the authenticated user.
   */
  public async getVideos(p: number = 1): Promise<VideosWrap> {
    return this.getUserVideos("user_video", p)
  }

  /**
   * Returns a new `APICollect` object for collecting videos for the authenticated user.
   */
  public getVideosCollect() {
    return new APICollect({
      dataGetter: (p: number) => this.getVideos(p)
    })
  }

  /**
   * Gets liked videos for the authenticated user.
   */
  public async getLikeVideos(p: number = 1): Promise<VideosWrap> {
    return this.getUserVideos("like_video", p)
  }

  /**
   * Returns a new `APICollect` object for collecting liked videos for the authenticated user.
   */
  public getLikeVideosCollect() {
    return new APICollect({
      dataGetter: (p: number) => this.getLikeVideos(p),
    })
  }

  /**
   * Gets videos for the authenticated user using a specified `tab`.
   */
  private async getUserVideos(tab: string, p: number = 1): Promise<VideosWrap> {
    const { body } = await this.client.get<UserLikeVideoResponse>({
      path: this.getRequestPath("self/video"),
      query: { tab, p }
    })

    const { result, ...data } = body
    return data.user_video
  }
}