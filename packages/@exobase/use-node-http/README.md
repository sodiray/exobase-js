An Exobase root hook for a raw Node HTTP/S server

## Install

Yarn

```sh
yarn add @exobase/use-node-http
```

## Usage

```ts
import https from 'https'
import { error } from '@exobase/core'
import { compose, toInt } from 'radash'
import { useRoute } from '@exobase/hooks'
import { useNodeHttp } from './useNodeHttp'

const server = https.createServer(
  compose(
    useNodeHttp(),
    useRoute('*', '/ping', pingEndpoint),
    useRoute('PUT', '/v1/library/book/*/return', returnBookEndpoint),
    useRoute('POST', '/v1/library/book', createBookEndpoint),
    useRoute('GET', '/v1/library/book/*', findBookEndpoint),
    useRoute('GET', '/v1/library/book', listBooksEndpoint),
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
