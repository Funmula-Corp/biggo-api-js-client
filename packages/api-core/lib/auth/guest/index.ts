import { BigGoAPIError, BigGoAPIErrorEnum } from "../../error"
import { HttpClient } from "../../http"
import { RequestParams, RequestReturn } from "../../http/types"

export class GuestClient extends HttpClient {
  protected async request<T = unknown>(params: RequestParams): Promise<RequestReturn<T>> {
    try {
      return await super.request<T>(params)
    } catch(error: any) {
      if(!(error instanceof BigGoAPIError)) {
        throw error
      }

      switch((error as BigGoAPIError).code) {
        case BigGoAPIErrorEnum.JWT_EXPIRED:
        case BigGoAPIErrorEnum.JWT_INVALID:
          return {
            body: undefined,
            headers: {}
          } as RequestReturn<T>
      }

      throw error
    }
  }
}