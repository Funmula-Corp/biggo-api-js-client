import { RESTClient } from "./http/types"

export type APIClientAbstractParams = {
  scope: string | string[]
}

export type APIClientRequired = {
  client: RESTClient
}

export type APIClientConfiguration = APIClientAbstractParams & APIClientRequired