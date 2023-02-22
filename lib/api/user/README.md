# BigGo Video API Client

## First Step

get api client.

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

get videos of user uploaded

`user.getVideos()`
* Return: `Promise<Video[]|undefined>`

```js
user.getVideos()
```

---

### Get Like Videos

get videos of user liked

`user.getLikeVideos()`

* Return: `Promise<Video[]>`

```js
user.getLikeVideos()
```

---

### Get Subscribe Product

get subscribe product of user

`user.getSubscribeProducts()`
* Return: `Promise<Product[]>`

```js
user.getSubscribeProducts()
```
