import { BigGoJWTClient as JWTClient } from "@funmula/api-core/lib/auth/jwt"
import nodeFetch, { Headers as nodeHeaders } from "node-fetch"
import nodeFormData from "form-data"
import { BigGoJwtInitParam } from "./types"

export class BigGoJWTClient extends JWTClient {
  readonly fetch = nodeFetch as unknown as typeof globalThis.fetch
  readonly Headers = nodeHeaders as unknown as typeof globalThis.Headers
  readonly FormData = nodeFormData as unknown as typeof globalThis.FormData

  constructor(params: BigGoJwtInitParam) {
    super({
      ...params,
      hostname: process.env.API_DOMAIN!,
      authHostname: process.env.API_AUTH_DOMAIN!,
    })
  }
}