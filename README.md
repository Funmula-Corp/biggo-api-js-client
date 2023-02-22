# BigGo API Javascript Client

biggo api client for javascript

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

### Quick start

```js
const client = auth.getJWTClient({
  client_id: "<api key>",
  client_secret: "<api secret>"
})

const video = api.video({ client })
const info = await video.get("<video id>")
```

## Document

|Path||
|:---:|---|
|/video|[Video Api Client](./lib/api/video#readme)|
|/user|[User Api Client](./lib/api/user#readme)|

## License

[MIT](./LICENSE)