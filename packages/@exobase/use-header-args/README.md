Provides a hook to parse and validate headers in the request.

## Install

Yarn

```sh
yarn add @exobase/use-header-args
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useHeaderArgs } from '@exobase/use-header-args'
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
  useHeaderArgs(z => ({
    'x-request-timestamp': zod.number(),
    'x-api-key': zod.string()
  })),
  createAccount
)
```
