import { HttpClient } from "../clients/http"

export * as JWT from "./jwt"

export class GuestClient extends HttpClient {
  constructor() {
    super(process.env.API_DOMAIN!)
  }
}
