export type JWTAuthResponse = JWTErrorResponse | {
  access_token: string
  token_type: string
  expires_in: number
}

export type JWTErrorResponse = { error: string }

export interface BigGoJWTClientInitialParams {
  client_id: string
  client_secret: string
  hostname: string
  authHostname: string
}