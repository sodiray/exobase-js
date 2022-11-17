Provides an Exobase hook that will capture tracing data in an AWS Lambda function

## Usage

```ts
import type { Props } from '@exobase/core'
import exo from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { useLambdaTracer } from '@exobase/use-lambda-tracer'

export const listLibraries = async (props: Props) => {
  return db.libraries.list()
}

export default exo()
  .root(useLambda())
  .hook(useLambdaTracer())
  .endpoint(async () => {
    throw new Error('404 Not found')
  })
```
