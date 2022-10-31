# `@exobase/use-basic-auth`

> Provides a Exobase hook function that will parse out the client id and client secret of an incoming request

_NOTE: This hook does not validate the values it parses, you'll need to do that on your own_

## Install

You can install this package directly

```sh
yarn add @exobase/use-basic-auth
```

or use the `useBasicAuth` hook through the `@exobase/hook` package

```sh
yarn add @exobase/hooks
```

## Import

```ts
import { useBasicAuth } from '@exobase/use-basic-auth'
// or
import { useBasicAuth } from '@exobase/hooks'
```

## Usage

You can use `useBasicAuth` to parse the client id and client secret from the request. You'll need to validate them yourself.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { useBasicAuth, BasicAuth } from '@exobase/use-basic-auth'

export const securePingEndpoint = async ({
  auth
}: Props<{}, {}, BasicAuth>) => {
  console.log(auth) // { clientId: 'abc', clientSecret: 'abc' }
  return {
    message: 'pong'
  }
}

export default compose(useNext(), useBasicAuth(), securePingEndpoint)
```

In order to keep auth logic out of your endpoints you'll probably want to create a custom hook function to validate
