# `@exobase/next`

> Exobase root hook to handle function running on Next.js api functions

## Usage

```ts
import * as _ from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/next'

const ping = async (props: Props) => {
  return {
    message: 'pong'
  }
}

export default _.compose(
  useNext,
  ping
)
```
