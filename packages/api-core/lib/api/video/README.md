# BigGo Video API Client

## First Step

To get started, first obtain an API key and secret from BigGo API. Then, use the following code to obtain an API client:

```js
import { auth, api } from "biggo-api"

const client = auth.getJWTClient({
  client_id: "<client id>",
  client_secret: "<client secret>"
})

const video = api.video({ client })
```

## Usage

### Get

get a video information.

`video.get(<video id>)`

* Return: `Promise<[Video]|undefined>` `undefined` if video not found

```js
video.get("<video id>")
```

---

### Create

Upload new video.

`video.upload([Options])`

* Return: `Promise<string>` video id

```js
video.upload({
  file: "<video file path>",
  description: "upload via api",
  access: "public",
  thumbnailTime: 0,
})
```

`[Options]`

||required|type|description|
|:---:|:---:|:---:|:---:|
|file|✔️|string|video file path|
|title|️️️️️️️️✔️|string|video title|
|description|✔️|string|video description|
|access|✔️|`public` `private` `unlisted`|video visibility setting|
|thumbnailTime||number|micro second of thumbnail in video|

---

### Update

Update video info.

`video.update(<video id>, [Options])`

* Return: `Promise<boolean>` `true` if updated success

```js
video.update("<video id>", {
  description: "upload via api",
  access: "public",
  thumbnailTime: 0,
})
```

`[Options]`

||required|type|description|
|:---:|:---:|:---:|:---:|
|title|️️️️️️️️ |string|video title|
|description| |string|video description|
|access| |`public` `private` `unlisted`|video visibility setting|
|thumbnailTime| |number|micro second of thumbnail in video|

---

### Delete

Remove video.

`video.delete(<video id>)`

* Return: `Promise<boolean>` `true` if removed success

```js
video.delete("<video id>")
```
