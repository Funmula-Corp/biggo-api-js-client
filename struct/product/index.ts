interface ProductMultipleItem {
  m_max_price?: string
  m_text?: string
  isMultipleProduct: boolean
}

interface ProductPromo {
  promo_title?: string
  promo_url?: string
  promo_btn?: string
}

interface ProductSubscribe {
  tags?: string[]
  subscribe: boolean
}

interface ProductSeller {
  username?: string
  "seller-credit"?: number
}

interface ProductPriceHistory {
  history_id: string
}

export interface BigGoProduct extends ProductMultipleItem, ProductPromo, ProductSubscribe, ProductSeller, ProductPriceHistory {
  id: string
  index: string
  purl: string
  url: string
  title: string
  currency: string
  symbol: string
  image: string
  price: number
  discount?: string[]
  isOffline: boolean
  online_notify?: boolean
}