---
title: 'useApiKey'
description: 'An API key authentication hook'
group: 'Hooks'
---

Exobase hook function that provides authentication by way of validating the `x-api-key` header.

## Install

```sh
yarn add @exobase/use-api-key
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useApiKey } from '@exobase/use-api-key'
// or
import { useApiKey } from '@exobase/hooks'
```

## Usage

You can use `useApiKey` to secure an endpoint with a single static key.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { useApiKey } from '@exobase/use-api-key'

export const securePingEndpoint = async (props: Props) => ({
  message: 'pong'
})

const SECRET_KEY = 'only-my-friends-know-this'

export default compose(useNext(), useApiKey(SECRET_KEY), securePingEndpoint)
```

If you need to validate the provided api key depending on the request you can pass an async function that will receive the props.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { useServices, useApiKey } from '@exobase/hooks'
import makeDatabase, { Database } from './database'

export const securePingEndpoint = async ({
  args,
  services
}: Props<Args, Services>) => {
  return {
    message: 'pong'
  }
}

const SECRET_KEY = 'only-my-friends-know-this'

export default compose(
  useNext(),
  useServices({
    db: makeDatabase
  }),
  useApiKey(async ({ services, request }) => {
    const { db } = services
    const clientId = request.headers['x-client-id']
    const client = await db.clients.find(clientId)
    return client?.apiKey
  }),
  securePingEndpoint
)
```

If you need to use this type of workflow, a few recomendations

1. To make sure you don't have to do the `db.clients.find` call more than once, use a custom hook to do the query and then save the client to the `Props` so any function in the composition can access.

2. So you don't have to copy the code in each function, compose the `useApiKey` into a custom hook that can be called without arguments.

### 1. Custom Client Lookup Hook

You can write this in your project, I like to keep them in a `/hooks` directory. The hook will do the database lookup and then append the `client` to the `Args` in the `Props`.

```ts
import { partial } from 'radash'
import type { Database } from './database'

type Args = {}
type Services = {
  db: Database
}

const withClientArg = (func: Handler, props: Props<Args, Services>) => {
  const { db } = props.services
  const clientId = request.headers['x-client-id']
  const client = await db.clients.find(clientId)
  return await func({
    ...props,
    args: {
      ...props.args,
      client
    }
  })
}

export const useClientArg = () => (func: Handler) => {
  return partial(withClientArg, func)
}
```

We can now use our `useClientArg` hook in a function.

```ts
export default compose(
  useNext(),
  useServices({
    db: makeDatabase
  }),
  useClientArg(),
  useApiKey(({ args }) => args.client?.apiKey),
  securePingEndpoint
)
```

That alone is much better, but we can still improve things.

### 2. Compose the useApiKey hook

We'll create another custom hook, this one is much much simpler

```ts
import { useApiKey } from '@exobase/hooks'
import type { Client } from './types'

type Args = {
  client: Client
}

export const useClientApiKey = () =>
  useApiKey(({ args }: Props<Args>) => args.client?.apiKey)
```

Now we can use it in our functions.

```ts
export default compose(
  useNext(),
  useServices({
    db: makeDatabase
  }),
  useClientArg(),
  useClientApiKey(),
  securePingEndpoint
)
```

### 3. Not Recommended

Personally, I don't recommend this. I think what we have now is a perfect balance of DRY and abstracted. But, so you know it's possible and incase you prefer it, I'll show you how to compose all this into a `useClientAuth` hook.

We'll create a new hook called `useClientAuth` where we'll wrap everything we need, start to finish, to authenticate a request of this type.

```ts
export const useClientAuth = () =>
  compose(
    useServices({
      db: makeDatabase
    }),
    useClientArg(),
    useClientApiKey()
  )
```

Then we can use it in our function.

```ts
export default compose(useNext(), useClientAuth(), securePingEndpoint)
```
