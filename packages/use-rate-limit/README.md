---
title: 'useRateLimit'
description: 'A hook to do request rate limiting'
group: 'Hooks'
---

An Exobase hook that will check if an incoming request has exceeded the configured maximum number of requests within the configured window. This hook requires a store to be passed and meet the `IRateLimitStore` interface (having `inc` and `reset` functions). You decide how to implement the storage mechanism as long as it surfaces the interface.

## Install

```sh
yarn add @exobase/use-rate-limit
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useCachedResponse } from '@exobase/use-rate-limit'
// or
import { useCachedResponse } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { useRateLimit, useServices } from '@exobase/hooks'

type Args = {
  id: string
}

export const findLibraryBookById = async ({ args }: Props<Args>) => {
  return db.libraries.find(args.id)
}

export default compose(
  useNext(),
  useServices({
    store // an objects matching the IRateLimitStore interface (having inc and reset functions)
  }),
  useRateLimit({
    key: 'library.book.by-id',
    window: '5 minutes'
    max: 200,
    toIdentity: (props) => props.request.ip
  }),
  listLibraries
)
```

### Using with Redis

Create a store module. Here I'm using redis, you can using anything by implementing your own `inc` and `reset` functions.

```ts
// file: store.ts
import { createClient } from 'redis'

const redis = createClient({
  url: config.redisUrl,
  username: config.redisUsername,
  password: config.redisPassword
})

redis.connect()

// NOTE: This is not the most robust redis
// implementation but it works and makes
// for a simple example.
export const store = {
  inc: async (key: string, timestamp: number) => {
    const created = await redis.setnx(`${key}:start`, `${timestamp}`)
    await redis.setnx(`${key}:count`, 1)
    if (!created)
      return {
        timestamp,
        count: 1
      }
    return {
      timestamp: await redis.get(`${key}:start`),
      count: await redis.incr(`${key}:count`)
    }
  },
  reset: async (key: string) => {
    await redis.del([`${key}:start`, `${key}:count`])
  }
}
```

### Using with Composition

You probably don't want to import the store in every endpoint function, you can compose it and create your own hook instead.

```ts
// file: useRateLimit.ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useRateLimit as useBaseRateLimit, useServices } from '@exobase/hooks'
import type { UseRateLimitOptions } from '@exobase/hooks'
import { store } from './store'

/**
 * All functions using this hook will use the
 * configured store and cap requests to a max
 * of 200 per 5 minutes.
 */
export const useRateLimit = (key: string) => (func) =>
  compose(
    useServices({
      store
    }),
    useBaseRateLimit({
      key,
      window: '5 minutes'
      max: 200,
      toIdentity: (props) => props.request.ip
    }),
    func
  )
```

### Custom Identity using Authentication

The above examples all use an identity function that references the ip address. In many cases you'll want to identify a requester by their authentication. The `toIdentity` function has access to the full props object so you can use any request input to create an identity.

```ts
import type { TokenAuth } from '@exobase/hooks'

export const useRateLimitByToken = (key: string) => (func) =>
  compose(
    useServices({
      store
    }),
    useBaseRateLimit({
      key,
      window: '24 hours'
      max: 1000,
      toIdentity: (props: Props<{}, {}, TokenAuth>) => props.auth.token.sub
    }),
    func
  )
```
