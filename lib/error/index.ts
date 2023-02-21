import { ErrorResponse } from "../clients/http/types"
import { BigGoAPIErrorEnum } from "./types"

export { BigGoAPIErrorEnum }

export class BigGoAPIError extends Error {
  code: BigGoAPIErrorEnum

  constructor({ error }: ErrorResponse) {
    super(error.message)
    Object.setPrototypeOf(this, BigGoAPIError.prototype)
    this.code = error.code
  }

  getErrorMessage() {
    return `BigGo API Error: ${this.message}, code: ${this.code}`
  }
}