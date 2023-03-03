# [v0.3.0]

## Changes

- change fields name limit -> access
- Splitting api and client code logic Putting api logic into packages to make monorepo

## Perf

- refactor http client implement

# [v0.2.2]

- changes video upload params type: products and thumbnailTime is not required

# [v0.2.1]

- changes user api client response type

# [v0.2.0]

## Breaking

- Rename fields name
  - `apiKey` => `client_id`
  - `apiSecretKey` => `client_secret`

## Changes

- Adding api client error handle, api error will perform `console.warn` in development mode(NODE_ENV=development)
- Adding user api client handle (/user)

# [v0.1.1]

- Add video fields title

# [v0.1.0]

- Video api CRUD
