import type { APIClientRequired } from "./types"
import { APIVideoClient } from "./video"

export function video(params: APIClientRequired) {
  return new APIVideoClient(params)
}