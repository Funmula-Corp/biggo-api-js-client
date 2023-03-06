# BigGo API Javascript Client

The BigGo API Javascript Client provides an easy-to-use interface for accessing the BigGo API using `Javascript` and `Typescript` in `Nodejs` runtime. It can be installed using `npm`, `yarn`, or `pnpm`.

## Installation

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

## Requirement

* Nodejs >= 16

## Usage

Using ESM:

```js
import { auth, api } from "biggo-api"
```

Using CJS:

```js
const { auth, api } = require("biggo-api")
```

## Getting Started

### Initializing Auth Client

To get started, first obtain an API key and secret from BigGo API. Then, use the following code to obtain an API client:

```js
const client = auth.getJWTClient({
  client_id: "<api key>",
  client_secret: "<api secret>"
})
```

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

## Supported APIs

This library currently supports the following BigGo APIs:

* `/video` - [Video Api Client](./packages/api-core/lib/api/video#readme)
* `/user` - [User Api Client](./packages/api-core/lib/api/user#readme)

## Typescript

This library supports typescript out of the box.

## License

[MIT](./LICENSE)