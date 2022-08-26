# `@exobase/core`

> Provides the core types and functions to implement the Abstract & Compose design pattern

If you're writing Exobase endpoint (following the Abstract & Compose design pattern) and you're using Typescript you'll probably want this package for the types. If you're developing your own Exobase hooks you'll want the core package for the response parsing functions.

## Install
```sh
yarn add @exobase/core
```

## Usage
If you're writing Exobase endpoints in Typescript you'll want to import the `Props` type.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core' 

const endpoint = (props: Props) => {
  console.log(props)
}

export default compose(
  // ... 
)
```

If you're writing your own hooks you'll want to use a bit more.

### Response Parsing

An Exobase endpoint function can return any object and it should be returned as the json body. If an Exobase endpoint returns a `Response` object it should be parsed and applied with all specified headers, body, and status.

The core package gives you a few small helpers to determine the shape of a returned object so you know how to handle it.

For an example, see the source for the `useExpress` hook.

```ts
import { initProps, responseFromError, responseFromResult } from '@exobase/core'
```

- `initProps` is a helper you can use in a root hook to generate the initial `Props` object
- `responseFromError` will convert an error object into an Exobase `Response`, handling Exobase error objects and unkonwn errors.
- `responseFromResult` will convert a function's result into an Exobase `Response`, handling both cases mentioned above.
