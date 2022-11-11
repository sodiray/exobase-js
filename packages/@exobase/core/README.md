# `@exobase/core`

> Provides the core types and functions to implement the Abstract & Compose design pattern with the Exobase library

If you're writing endpoints (following the Abstract & Compose design pattern) and you're using Typescript you'll probably want this package for the types. If you're developing your own hooks you'll want the core package for the response parsing functions.

## Install

```sh
yarn add @exobase/core
```

## Usage

If you're writing endpoints in Typescript you'll want to import the `Props` type.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'

const endpoint = (props: Props) => {
  console.log(props)
}
```

### Response Parsing

An endpoint function can return any object as the result. If the result is an `AnbstractResponse` object it should be parsed and applied with all specified headers, body, and status. If the result is any other object it should be treated as the json body and returned as such in the response.

The core package gives you a few small helpers to deal with these results that are not always known. A function can throw an error, return an `Response` object, or return any other object. In almost any case, all of these need to be converted to an `Response` so they can be applied to a framework.

For an example, see the source for the `useExpress` hook.

```ts
import { props, responseFromError, responseFromResult } from '@exobase/core'
```

- `props` is a helper you can use in a root hook to generate the initial `Props` object. Think of it like a constructor.
- `responseFromError` will convert an error object into an `Response`, handling error objects and unkonwn errors.
- `responseFromResult` will convert a function's result into an `Response`, handling both cases mentioned above.
