---
title: 'usePathParser'
description: 'A hook to parse url path params'
group: 'Hooks'
---

An Exobase hook that will parse path params and set them on the request. This hook is a bit unusual because it makes a change to the `request` to add the parsed path parameters. There are not many cases where you'll need this. Either

- The framework + root hook your running will parse the path params (Next.js is an example of this) and set them in the request
- The `useRouter` hook will parse the params and set them in the request

This hook does not validate the params, it only looks at the template path you give and the path of the current request and parses out the variable segments. To do validation, use `usePathParams`.

## Install

```sh
yarn add @exobase/use-path-parser
# or
yarn add @exobase/hooks
```

## Import

```ts
import { usePathParser } from '@exobase/use-path-parser'
// or
import { usePathParser } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { usePathParser } from '@exobase/use-path-parser'

export const findBookById = async (props: Props) => {
  console.log(props.request.params) // { id: 'art-of-war' }
}

export default compose(
  useLambda(),
  usePathParser('/library/books/{id}')
  findBookById
)
```
