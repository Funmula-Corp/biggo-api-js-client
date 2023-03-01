import { APIVideoClient } from "./video"
import { APIUserClient } from "./user"
import { APIClientRequired } from "../types"

export { APIClient } from "./client"

export function video(params: APIClientRequired) {
  return new APIVideoClient(params)
}

export function user(params: APIClientRequired) {
  return new APIUserClient(params)
}
