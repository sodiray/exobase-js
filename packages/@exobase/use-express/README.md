An Exobase root hook for the ExpressJS framework

## Install

Yarn

```sh
yarn add @exobase/use-express
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useExpress } from '@exobase/use-express'

const endpoint = (props: Props) => {
  console.log(props)
}

export default compose(useExpress(), endpoint)
```
