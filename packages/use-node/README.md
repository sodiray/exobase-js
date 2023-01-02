---
title: 'useNode'
description: 'A root hook to handle the standard Node.js http/https server framework'
group: 'Root Hooks'
badge: 'Node.js'
---

An Exobase root hook for a raw Node HTTP/S server

## Install

```sh
yarn add @exobase/use-node
```

## Import

```ts
import { useNode } from '@exobsae/use-node'
```

## Usage

```ts
import https from 'https'
import { error } from '@exobase/core'
import { compose, toInt } from 'radash'
import { useRouter } from '@exobase/hooks'
import { useNode } from '@exobase/use-node'

const server = https.createServer(
  compose(
    useNode(),
    useRouter(router => router
      .on(['GET', 'POST'], '/ping', pingEndpoint)
      put('/v1/library/book/*/return', returnBookEndpoint),
      post('/v1/library/book', createBookEndpoint),
      get('/v1/library/book/*', findBookEndpoint),
      get('/v1/library/book', listBooksEndpoint),
    ),
    async () => {
      throw error({
        status: 404,
        message: 'Not found'
      })
    }
  )
)

const port = toInt(process.env.PORT, 8500)

server.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
```
