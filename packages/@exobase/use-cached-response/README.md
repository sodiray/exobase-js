An Exobase hook that will check incoming request argument for a match in the cache, if one exists it will be returned without executing the endpoint function.

## Install

```sh
yarn add @exobase/use-cached-response
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useCachedResponse } from '@exobase/use-cached-response'
// or
import { useCachedResponse } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { useCachedResponse, useServices } from '@exobase/hooks'

type Args = {
  id: string
}

export const findLibraryBookById = async ({ args }: Props<Args>) => {
  return db.libraries.find(args.id)
}

export default compose(
  useNext(),
  useServices({
    cache // an objects matching the Cache interface (having get and set functions)
  }),
  useCachedResponse({
    key: 'library.book.by-id',
    ttl: '1 hour'
  }),
  listLibraries
)
```

### Using with Redis

Create a caching module. Here I'm using redis, you can using anything by implementing your own `get` and `set` functions.

```ts
// file: cache.ts
import { createClient } from 'redis'

const redis = createClient({
  url: config.redisUrl,
  username: config.redisUsername,
  password: config.redisPassword
})

redis.connect()

export default {
  get: (key: string) => redis.get(key),
  set: (key: string, value: string, ttl: number) =>
    redis.set(key, value, {
      EX: options.ttl
    })
}
```

Then, wire your caching module into the function's services so the `useCachedResponse` hook can use it

```ts
import cache from './cache'

export default compose(
  useNext(),
  useServices({
    cache
  }),
  useCachedResponse({
    key: 'library.book.by-id',
    ttl: '1 hour'
  }),
  listLibraries
)
```

### Using with Composition

You probably don't want to import the cache in every endpoint function, you can compose it and create your own hook instead.

```ts
// file: useCache.ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useCachedResponse, useServices } from '@exobase/hooks'
import type { UseCachedResponseOptions } from '@exobase/hooks'
import cache from './cache'

export const useCache = (opts: Pick<UseCachedResponseOptions, 'key' | 'ttl'>) =>
  compose(
    useServices({
      cache
    }),
    useCachedResponse({
      key: opts.key,
      ttl: opts.ttl
    })
  )
```

Now in your endpoint functions you can simply call your own `useCache` hook which will always come with the `cache` it needs.

```ts
import { useCache } from './useCache'

export default compose(
  useNext(),
  useCache({
    key: 'library.book.by-id',
    ttl: '1 hour'
  }),
  listLibraries
)
```
