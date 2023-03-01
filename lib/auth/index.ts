import { BigGoJWTClient } from "./jwt"
import { BigGoJwtInitParam } from "./types"

export * as JWT from "./jwt"

export function getJWTClient(init: BigGoJwtInitParam) {
  return new BigGoJWTClient(init)
}