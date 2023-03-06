# BigGo User API Client

This is a client library for accessing BigGo User API.

## First Step

To get started, first obtain an API key and secret from BigGo API. Then, use the following code to obtain an API client:

```js
import { auth, api } from "biggo-api"

const client = auth.getJWTClient({
  client_id: "<api key>",
  client_secret: "<api secret>"
})

const user = api.user({ client })
```

## Usage

### Get Videos

To get a list of videos uploaded by the user, use the `getVideos()` method:

```js
user.getVideos()
```

This method returns a promise that resolves to an object containing an array of Video objects and the total number of videos.

```ts
{ size: number, data: Video[] }
```

---

### Get Liked Videos

To get a list of videos liked by the user, use the following code:

```js
user.getLikeVideos()
```

This method returns a promise that resolves to an array of Video objects and the total number of liked videos.

```ts
{ size: number, data: Video[] }
```
