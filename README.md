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

### Quick start

```js
const client = auth.getJWTClient({
  client_id: "<api key>",
  client_secret: "<api secret>"
})

const video = api.video({ client })
const info = await video.get("<video id>")
```

## Supported APIs

This library currently supports the following BigGo APIs:

* `/video` - [Video Api Client](./packages/api-core/lib/api/video#readme)
* `/user` - [User Api Client](./packages/api-core/lib/api/user#readme)

## Typescript

This library supports typescript out of the box.

## License

[MIT](./LICENSE)