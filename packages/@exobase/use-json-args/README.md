# `@exobase/use-json-args`

> Provides hooks

## Install

Yarn

```sh
yarn add @exobase/use-json-args
```

## Usage

If you're writing Exobase endpoints in Typescript you'll want to import the `Props` type.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useJsonArgs } from '@exobase/use-json-args'
import { useLambda } from '@exobase/use-lambda'

type Args = {
  username: string
  password: string
}

const createAccount = async ({ args }: Props) => {
  // await db.users.add({
  //   username: args.username,
  //   password: args.password
  // })
}

const STRONG =
  /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/

export default compose(
  useLambda(),
  useJsonArgs(yup => ({
    username: yup.string().required(),
    password: yup
      .string()
      .matches(STRONG, { message: 'Password is too weak' })
      .required()
  })),
  createAccount
)
```
