# BigGo API Javascript Client

BigGo API Javascript Client is a video API written in Javascript. We have two APIs included so far and will update more APIs and the function in each of them in the short future:

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Initializing Auth Client](#initializing-auth-client)
  - [Accessing BigGo API](#accessing-biggo-api)
- [Features](#features)
  - [Video API](#video-api)
  - [User API](#user-api)
- [Typescript](#typescript)
- [License](#license)

## Getting Started

### Installation

Using npm

```shell
npm i biggo-api --save
```

Using yarn

```shell
yarn add biggo-api
```

Using pnpm

```shell
pnpm add biggo-api
```

### Usage

Using ESM:

```js
import { auth, api } from "biggo-api"
```

Using CJS:

```js
const { auth, api } = require("biggo-api")
```

### Initializing Auth Client

To get started, first obtain a client id and secret from BigGo API. Then, use the following code to obtain an API client:

```js
const client = auth.getJWTClient({
  client_id: "<client id>",
  client_secret: "<client secret>"
})
```

You can refer to this guide to get the client id and secret

[Funmula/guideFunmula-Corp/guide](https://github.com/Funmula-Corp/guide)

### Accessing BigGo API

You can use a similar approach to access all BigGo API resources using the api object. Simply create a new instance of the desired resource, passing in the client object obtained from auth.getJWTClient(). For example:

```js
// access /video api
const video = api.video({ client })
// get video information
const info = await video.get("<video id>")

// access /user api
const user = api.user({ client })
// get liked videos on biggo in you account
const likedVideos = await user.getLikeVideos()

// Use other resources in a similar way...
```

## Features

This library currently supports the following BigGo APIs:

- `/video` - [Video Api](./packages/api-core/lib/api/video#readme)
- `/user` - [User Api](./packages/api-core/lib/api/user#readme)

### Video API

- Uploading videos.
- Getting video information - Using video ID to get the information for both video and the uploader. (ex: user ID, description, etc. )
- Editing video settings - Editing video title, description, accessibility, etc.
- Deleting videos.

### User API

- Getting video information on all uploaded videos on the personal video list.

## Typescript

This library supports typescript out of the box.

## License

[MIT](./LICENSE)
