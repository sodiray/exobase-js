Provides an Exobase hook to parse and validate a JWT token in a request. It also includes a utility for generating JWT tokens.

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
