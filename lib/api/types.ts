import { HttpClient } from "../clients/http"

export type APIClientAbstractParams = {
  scope: string | string[]
}

export type APIClientRequired = {
  client: HttpClient
}

export type APIClientConfiguration = APIClientAbstractParams & APIClientRequired