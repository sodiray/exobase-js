---
title: 'useTokenAuth'
description: 'A hook to validate id or access token authentication'
group: 'Auth'
---

Provides an Exobase hook to parse and validate a JWT token in a request. It also includes a utility for generating JWT tokens.

## Install

```sh
yarn add @exobase/use-token-auth
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useTokenAuth } from '@exobase/use-token-auth'
// or
import { useTokenAuth } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useTokenAuth } from '@exobase/use-token-auth'

const endpoint = (props: Props) => {
  console.log(props)
}

export default compose(
  useExpress(),
  useTokenAuth({
    type: 'id',
    secret: 'my-little-secret'
  }),
  endpoint
)
```
