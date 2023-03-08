import { ErrorResponse } from "../http/types"
import { BigGoAPIErrorEnum, BigGoUnionErrorEnum, BigGoAuthErrorEnum } from "./types"

export { BigGoAPIErrorEnum, BigGoAuthErrorEnum }

export class BigGoAPIError<E extends BigGoUnionErrorEnum = BigGoAPIErrorEnum> extends Error {
  code: E

  constructor({ error }: ErrorResponse<E>) {
    super(error.message)
    Object.setPrototypeOf(this, BigGoAPIError.prototype)
    this.code = error.code as E
  }

  getErrorMessage() {
    return `BigGo API Error: ${this.message}, code: ${this.code}`
  }
}
