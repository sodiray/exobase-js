# `@exobase/core`

> Provides the core types and functions to implement the Abstract & Compose design pattern

If you're writing Exobase endpoint (following the Abstract & Compose design pattern) and you're using Typescript you'll probably want this package for the types. If you're developing your own Exobase hooks you'll want the core package for the response parsing functions.

## Install
Yarn
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
