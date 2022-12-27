---
title: 'useNext'
description: 'A root hook to handle the Next.js application framework'
group: 'Root Hooks'
---

Exobase root hook to handle function running on Next.js api functions

## Install

```sh
yarn add @exobase/use-next
```

## Import

```ts
import { useNext } from '@exobase/use-next'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'

export const pingEndpoint = async (props: Props) => {
  return {
    message: 'pong'
  }
}

export default compose(useNext(), pingEndpoint)
```
