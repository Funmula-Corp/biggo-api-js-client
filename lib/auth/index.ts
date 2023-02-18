import { HttpClient } from "../clients/http"
import { BigGoJWTClient } from "./jwt"
import type { BigGoJWTClientInitialParams } from "./jwt/types"

export * as JWT from "./jwt"

export class GuestClient extends HttpClient {
  constructor() {
    super(process.env.API_DOMAIN!)
  }
}

export function getJWTClient(init: BigGoJWTClientInitialParams) {
  return new BigGoJWTClient(init)
}