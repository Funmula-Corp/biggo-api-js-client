/**
 * Interface representing the collected data from pages.
 * It contains the total number of items
 * and an array of items for a given page.
 */
interface CollectData<T> {
  size: number
  data: T[]
}


interface APICollectInit<T> {
  /**
   * A function that returns a promise containing collect data.
   */
  dataGetter(page: number): Promise<CollectData<T>>
}

export class APICollect<T> {
  static readonly DEF_PAGE_SIZE: number = 20
  readonly getter: (page: number) => Promise<CollectData<T>>

  #size: number = 0
  #page: number = 0
  pageSize: number
  pageData: {expired: boolean, data: T[]}[] = []

  constructor({ dataGetter }: APICollectInit<T>) {
    this.getter = dataGetter
    this.pageSize = APICollect.DEF_PAGE_SIZE
  }

  /**
   * Returns the current page number.
   */
  get page() {
    return this.#page + 1
  }

  /**
   * Returns an array of all the items collected across all pages.
   */
  get data() {
    return this.pageData.reduce((list, data) => [...list, ...data.data], [] as T[])
  }

  /**
   * Returns the maximum page number for collecting the data.
   */
  get maxPage() {
    if(!this.#size) {
      return 1
    }

    return this.#size / this.pageSize + (this.#size % this.pageSize > 0 ? 1 : 0)
  }

  /**
   * Resets the collect data with the specified `page`.
   * If no `page` is specified, clears entire collect data.
   */
  reset(page?: number) {
    if(typeof page === "number" && this.pageData[page - 1]) {
      this.pageData[page - 1].expired = true
      return
    }

    this.pageData = this.pageData.map((data) => ({data: data.data, expired: true}))
  }

  /**
   * Sets the cursor to the specified `page`.
   */
  setCursor(page: number) {
    if(page > this.maxPage) {
      this.#page = this.maxPage - 1
    }

    if(page <= 0) {
      this.#page = 0
    }

    this.#page = page - 1
  }

  /**
   * Collect all data through all pages.
   */
  async getAll(): Promise<T[]> {
    const originCursor = this.page
    this.setCursor(0)

    while(true) {
      if(!(await this.next())) {
        break
      }
    }

    this.setCursor(originCursor)
    return this.data
  }

  /**
   * Gets next page's collection data.
   */
  async next(): Promise<T[]|undefined> {
    if(this.page >= this.maxPage && this.#size >= 1) {
      return undefined
    }

    this.#page++
    return this.getPageData()
  }

  /**
   * Gets previous page's collection data.
   */
  async previous(): Promise<T[]|undefined> {
    if(this.page === 1) {
      return undefined
    }

    this.#page--
    return this.getPageData()
  }

  /**
   * Gets the page data for the current page. This method attempts to use caching first.
   */
  async getPageData(): Promise<T[]|undefined> {
    const page = this.page
    const cache = this.getCache(page)
    if(cache) {
      return cache
    }

    const { data, size } = await this.getData(page)
    this.pageData[page] = {data, expired: false}
    this.#size = size
    this.pageSize = this.#size > data.length && data.length > this.pageSize
      ? data.length : this.pageSize
    return data.length ? data : undefined
  }

  /**
   * Gets the collection data for the given page.
   */
  async getData(page: number) {
    return this.getter(page)
  }

  /**
   * Gets cached collection data for the specified page.
   */
  getCache(page: number): T[]|undefined {
    const cache = this.pageData[page]
    if(cache && !cache.expired) {
      return cache.data
    }

    return undefined
  }
}