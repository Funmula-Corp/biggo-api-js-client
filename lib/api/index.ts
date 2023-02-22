import { APIUserClient } from "./user"
import { APIVideoClient } from "./video"
import type { APIClientRequired } from "./types"

export function video(params: APIClientRequired) {
  return new APIVideoClient(params)
}

export function user(params: APIClientRequired) {
  return new APIUserClient(params)
}