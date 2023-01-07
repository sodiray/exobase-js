---
title: 'useRoleAuthorization'
description: 'A role authorization hook'
group: 'Hooks'
badge: 'Auth'
---

Exobase hook to check if a request is authorized given the roles that are attached to it.

## Install

```sh
yarn add @exobase/use-role-authorization
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useRoleAuthorization } from '@exobase/use-role-authorization'
// or
import { useRoleAuthorization } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { useRoleAuthorization, useTokenAuth } from '@exobase/hooks'
import type { TokenAuth } from '@exobase/hooks'

type Args = {
  id: string
  price: number
}

type Services = {
  db: Database
}

export const updateListing = async ({
  args,
  services
}: Props<Args, Services, TokenAuth>) => {
  const { id, price } = args
  const { db } = services
  await db.listings.update(id, { price })
}

export default compose(
  useNext(),
  useJsonBody(z => ({
    id: z.string(),
    price: z.number()
  })),
  useTokenAuth(config.auth.tokens.secret),
  useRoleAuthorization<Props<Args, {}, TokenAuth>>({
    roles: ({ auth }) => auth.token.roles,
    require: 'admin'
  }),
  useServices<Services>({
    db: () => new Database()
  })
  updateListing
)
```