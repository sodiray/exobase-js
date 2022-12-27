---
title: 'useHeaders'
description: 'A hook to parse and validate request headers'
group: 'Hooks'
---

Provides a hook to parse and validate headers in the request.

## Install

```sh
yarn add @exobase/use-headers
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useHeaders } from '@exobase/use-headers'
// or
import { useHeaders } from '@exobase/hooks'
```

## Import

```ts
import { useHeaders } from '@exobase/use-headers'
import { useHeaders } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useHeaders } from '@exobase/use-headers'
import { useLambda } from '@exobase/use-lambda'

type Args = {
  'x-request-timestamp': number
  'x-api-key': string
}

const createAccount = async ({ args }: Props) => {
  await db.users.add({
    username: args.username,
    password: args.password
  })
}

export default compose(
  useLambda(),
  useHeaders(z => ({
    'x-request-timestamp': zod.number(),
    'x-api-key': zod.string()
  })),
  createAccount
)
```
