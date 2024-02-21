---
title: 'useMetadata'
description: 'A hook to attach properties to a composed function'
group: 'Hooks'
badge: 'Metadata'
---

An Exobase hook that attaches properties to the final composed function.

## Install

```sh
yarn add @exobase/use-metadata
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useMetadata } from '@exobase/use-metadata'
// or
import { useMetadata } from '@exobase/hooks'
```

## Usage

You can add the `useMetadata` hook anywhere, it will attach the properies you provide to the final function returned by the compose function.

```ts
import { compose } from 'radash'
import { useExpress } from '@exobaes/use-express'
import { useMetadata } from '@exobase/use-metadata'

const handler = compose(
  useExpress(),
  useMetadata({
    route: '/api/v1/users',
    method: 'POST'
  }),
  (props) => {
    throw new DatabaseSecretError('The given secret password1 was incorrect')
  }
)

console.log(handler.route)  // => '/api/v1/users'
console.log(handler.method) // => 'POST'
```
