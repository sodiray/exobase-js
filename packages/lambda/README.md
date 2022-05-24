# `@exobase/lambda`

> Exobase root hook to handle function running on AWS Lambda. Built to support invocation from api gateway

## Install

```
yarn add @exobase/lambda
```

## Usage

```ts
import _ from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/lambda'

export const pingEndpoint = async (props: Props) => {
  return {
    message: 'pong'
  }
}

export default _.compose(
  useLambda(),
  pingEndpoint
)
```

