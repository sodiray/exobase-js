---
title: 'useLogging'
description: 'A hook to log request and response information'
group: 'Hooks'
badge: 'Logging'
---

Provides an Exobase hook that will log information about the request given a string of tokens.

This module inspired by [morgan](https://github.com/expressjs/morgan), the logging middleware library for Express.

## Install

```sh
yarn add @exobase/use-logging
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useLogging } from '@exobase/use-logging'
// or
import { useLogging } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { useLogging } from '@exobase/use-logging'

export const listLibraries = async (props: Props) => {
  return db.libraries.list()
}

export default compose(
  useNext(),
  useLogging(),
  useLogging('[:method] :path at :date(iso) -> :status in :ms-elapsed'),
  useLogging('[:method] :request-id', {
    format: message => JSON.stringify({ message }),
    logger: console,
    tokens: (l, p, e, r) => ({
      'request-id': () => p.request.headers['x-request-id']
    })
  }),
  listLibraries
)
```
