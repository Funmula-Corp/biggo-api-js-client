import { VideoVisibility, VideoProcessStatus } from "./types"

export interface VideoUserInfo {
  profileimg: string
  name: string
  at_userid: string
  userid: string
  description: string
  personal_url: string[]
  isVerifyEComm: boolean
  isVerifyUser: boolean
  follower_count: number
  follow_count: number
  all_like_count: number
  is_follow: boolean
  is_myvideo: boolean
}

export interface BigGoVideoProduct {
  provide: string
  id: string
  index: string
  type: string
  more: boolean
  currency: string
  price: number
  symbol: string
  original_symbol: string
  location: string
  original_price: number
  image: string
  origimage: string
  gallery_count: number
  gallery_images: string[],
  hasShop: boolean
  uid: string
  is_adult: boolean
  url: string
  purl: string
  title: string
  discount: string[]
  username: string
  history_id: string
  isMultipleProduct: boolean
  m_max_price: string
  m_text: string
  subscribe: boolean
  isAD: boolean
  isOffline: boolean
  isNotFound: boolean
  price_diff_real: number
  hasStorePage: boolean
  online_notify: boolean
}

export interface BigGoVideoProcessStatus {
  processing: false
  process_status: VideoProcessStatus
  process_status_kw: string[]
}

export interface BigGoVideo {
  video_id: string
  status: BigGoVideoProcessStatus
  userid: string
  created_at: string
  timestamp: number
  url: string
  description: string
  access: VideoVisibility
  video_comment_count: number
  video_like_count: number
  view_count: number
  hasProduct: boolean
  product_count: number
  str_datetime: string
  is_edited: boolean
  product_list: BigGoVideoProduct[]
  is_myvideo: boolean
  is_private: boolean
  is_like: boolean
  meta: {
    cover_image: string
    length: number
    iso8601_length: string
    thumbnails: string[]
    aspect_ratio: null | string
    download: {
      mp4: string
    }
  }
  is_follow: boolean
  profileimg: string
  name: string
  at_userid: string
  isVerifyEComm: boolean
  isVerifyUser: boolean
}