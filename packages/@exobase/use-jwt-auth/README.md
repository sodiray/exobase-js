# `@exobase/use-jwt-auth`

> Provides an Exobase hook to parse and validate a JWT token in a request. It also includes a utility for generating JWT tokens.

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useJWTAuth } from '@exobase/use-jwt-auth'

const endpoint = (props: Props) => {
  console.log(props)
}

export default compose(
  useExpress(),
  useJWTAuth({
    type: 'id',
    secret: 'my-little-secret'
  }),
  endpoint
)
```
