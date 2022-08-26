# `@exobase/next`

> Exobase root hook to handle function running on Next.js api functions

## Install
```sh
yarn add @exobase/next
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/next'

export const pingEndpoint = async (props: Props) => {
  return {
    message: 'pong'
  }
}

export default compose(
  useNext(),
  pingEndpoint
)
```

