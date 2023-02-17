export type JWTAuthResponse = JWTErrorResponse | {
  access_token: string
  token_type: string
  expires_in: number
}

export type JWTErrorResponse = { error: string }

export interface BigGoJWTClientInitialParams {
  apiKey: string
  apiSecretKey: string
}