import { BaseResponse } from "../../clients/http/types"
import { VideoProcessStatus } from "../video/types"

export interface BigGoUser {
  userid: string
  at_userid: string
  name: string
  profileimg: string
  description: string
  isVerifyEComm: boolean
  isVerifyUser: boolean
  personal_url: string
}

export interface UserVideo {
  video_id: string
  status: {
    processing: boolean
    process_status: VideoProcessStatus
    process_status_kw: string[]
  }
  userid: string
  created_at: string
  timestamp: number
  url: string
  description: string
  limit: number
  video_comment_count: number
  video_like_count: number
  view_count: number
  hasProduct: boolean
  product_count: number
  product_list?: {
    title: string
    price: number
    symbol: string
    image: string
  }[]
  str_datetime: string
  is_edited: boolean
  meta: {
    length: 482,
    iso8601_length: string
    thumbnails: string[]
    aspect_ratio: null | string
    cover_image: string
    download: {
      mp4: string
    }
  },
  like_list: string[]
  name: string
  profileimg: string
  at_userid: string
  isVerifyEComm: boolean
  isVerifyUser: boolean
  is_follow: boolean
  is_like: boolean
  is_myvideo: boolean
}

export interface UserSubscribe {
  id: string
  nindex: string
  oid: number
  isMultipleProduct: boolean
  is_adult: boolean
  symbol: string
  discount: string[]
  hasStorePage: boolean
  isOffline: boolean
  isNotfound: boolean
  price: number
  price_diff_real: number
  history_id: string
  ori_currency: string
  currency: string
  store_image: string
  name: string
  hasCashBack: boolean
  createtime: string
  title: string
  purl: string
  url: string
  gallery_count: string
  image: string
  origimage: string
  gallery_images: string[]
  cata: string[]
  tags: string[]
}

export type UserBaseResponse = BaseResponse & {
  is_owner: boolean
  user: BigGoUser
  subscribe_count: number
  user_video_count: number
  follower_count: number
  like_video_count: number
  follow_count: number
  all_like_count: number
  show_subscribe_product: string
  show_subscribe_video: boolean
  is_processing: string[]
}

export type UserVideoResponse = UserBaseResponse & {
  user_video: {
    size: number
    data: UserVideo[]
  }
}

export type UserLikeVideoResponse = UserBaseResponse & {
  like_video: {
    size: number
    data: UserVideo[]
  }
}

export type UserSubscribeResponse = UserBaseResponse & {
  subscribe_product: {
    all_total: number
    rtotal: number
    q: string
    data: UserSubscribe[]
  }
}

export type UserSelfResponse = BaseResponse & {
  region: string
  userid: string
  at_userid: string
}