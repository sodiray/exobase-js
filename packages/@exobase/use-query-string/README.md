Provides a hook to parse and validate query string values in the request.

## Install

Yarn

```sh
yarn add @exobase/use-query-string
```

or install `useQueryString` with all other Exobase provided hooks:

```sh
yarn add @exobase/hooks
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
