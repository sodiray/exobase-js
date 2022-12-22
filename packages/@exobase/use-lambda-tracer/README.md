Provides an Exobase hook that will capture tracing data in an AWS Lambda function.

## Install

```sh
yarn add @exobase/use-lambda-tracer
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useLambdaTracer } from '@exobase/use-lambda-tracer'
// or
import { useLambdaTracer } from '@exobase/hooks'
```

## Usage

```ts
import type { Props } from '@exobase/core'
import exo from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { useLambdaTracer } from '@exobase/use-lambda-tracer'

export default exo()
  .root(useLambda())
  .hook(useLambdaTracer())
  .endpoint(async () => {
    return { message: 'traced' }
  })
```

If you want to customize the tracer instance you can provide your own `Tracer` in the hook options.

```ts
import type { Props } from '@exobase/core'
import exo from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { useLambdaTracer } from '@exobase/use-lambda-tracer'

export default exo()
  .root(useLambda())
  .hook(
    useLambdaTracer({
      tracer: () => new Tracer({ serviceName: 'warehouse' }),
      tracer: async props => new Tracer({ serviceName: 'warehouse' }),
      tracer: new Tracer()
    })
  )
  .endpoint(async () => {
    return { message: 'traced' }
  })
```

If you do use your own tracer this is a good time to compose hooks so you don't need to repeat your tracer setup.

```ts
// hooks/useLambdaTracer.ts
import * as exo from '@exobase/use-lambda-tracer'

const useLambdaTracer = () =>
  exo.useLambdaTracer({
    tracer: new Tracer({ serviceName: 'api' })
  })
```

then, in all your endpoints import and use your own hook

```ts
import { useLambdaTracer } from './hooks/useLambdaTracer'

// ...

export default compose(
  useLambda(),
  useLambdaTracer()
  // ...
)
```
