---
title: 'useQueryString'
description: 'A hook to parse and validate a request query string'
group: 'Hooks'
---

Provides a hook to parse and validate query string values in the request.

## Install

```sh
yarn add @exobase/use-query-string
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useQueryString } from '@exobase/use-query-string'
// or
import { useQueryString } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useQueryString } from '@exobase/use-query-string'
import { useLambda } from '@exobase/use-lambda'

type Args = {
  id: number
  format: 'basic' | 'detailed'
}

const getAccount = async ({ args }: Props) => {
  const { id, format } = args
  const account = await db.accounts.find(id)
  return format === 'basic'
    ? mappers.Account.basic(account)
    : mappers.Account.detailed(account)
}

export default compose(
  useLambda(),
  useQueryString(z => ({
    id: zod.string(),
    format: zod.string()
  })),
  getAccount
)
```
