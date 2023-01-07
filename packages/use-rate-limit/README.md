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
    limit: {
      window: '5 minutes'
      max: 200,
    }
    toIdentity: (props) => props.request.ip
  }),
  listLibraries
)
```

### Using with Redis store

Create a store module. Here I'm using redis, you can using anything by implementing your own `inc` and `reset` functions.

```ts
// file: redis-store.ts
import { createClient } from 'redis'

const redis = createClient({
  url: config.redisUrl,
  username: config.redisUsername,
  password: config.redisPassword
})

redis.connect()

// NOTE: This is not the most robust redis
// implementation but makes for a simple
// example.
export const store = {
  inc: async (key: string) => {
    const now = Date.now()
    const created = await redis.setnx(`${key}:start`, `${now}`)
    await redis.setnx(`${key}:count`, 1)
    if (created)
      return {
        timestamp: now,
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
import { useRateLimit } from '@exobase/hooks'
import { store } from './redis-store'

/**
 * All functions using this hook will use the
 * configured store and cap requests to a max
 * of 200 per 5 minutes.
 */
export const useRedisRateLimit = (key: string) =>
  useRateLimit({
    key,
    limit: {
      window: '5 minutes'
      max: 200,
    },
    store,
    toIdentity: (props) => props.request.ip
  })
```

### Custom Identity using Authentication

The above examples all use an identity function that references the ip address. In many cases you'll want to identify a requester by their authentication. The `toIdentity` function has access to the full props object so you can use any request input to create an identity.

```ts
import { useRateLimit } from '@exobase/hooks'
import type { TokenAuth } from '@exobase/hooks'
import type { Props } from '@exobase/core'

export const useRateLimitByToken = (key: string) =>
  useRateLimit({
    key,
    limit: {
      window: '24 hours'
      max: 1000,
    },
    toIdentity: (props: Props<{}, {}, TokenAuth>) => props.auth.token.sub
  })
```

### Using with an in-memory store

Create a store object that meets the `IRateLimitStore` interface and uses a simple variable in memory to track usage.

```ts
import { useRateLimit } from '@exobase/hooks'

const db = {}

export const store = {
  inc: async (key: string, timestamp: number) => {
    db[key] = db[key] ?? {
      timestamp,
      count: 0
    }
    db[key].count++
    return db[key]
  },
  reset: async (key: string) => {
    delete db[key]
  }
}

export const useInMemoryRateLimit = (key) =>
  useRateLimit({
    key,
    limit: {
      window: '5 minutes'
      max: 200,
    },
    store,
    toIdentity: (props) => props.request.ip
  })
```

### Using with plan specific limits

Many use cases have specific rate limit rules for a users plan. For example, a free user may be limited to 100 requests/hour while a paid user is limited to 10,000 requests/hour. To support this, you can pass `limit` as an async function that receives the props as an argument. Use the function form to lookup the limits for the current user.

```ts
useRateLimit({
  key,
  limit: async (props: Props<{}, {}, TokenAuth>) => {
    const userId = props.auth.token.sub
    const plan = await db.plans.findForUser(userId)
    return {
      window: '1 hour'
      max: plan.type === 'paid' ? 10_000 : 1_000,
    }
  },
  store,
  toIdentity: (props) => props.request.ip
})
```
