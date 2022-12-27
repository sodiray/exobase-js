---
title: 'useExpress'
description: 'A root hook for the Express.js API framework'
group: 'Root Hooks'
---

An Exobase root hook for the ExpressJS framework

## Install

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
