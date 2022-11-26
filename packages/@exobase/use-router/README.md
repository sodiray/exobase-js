Provides an Exobase hook that does method + url routing using a trie based on the given url path.

## Usage

```ts
import https from 'https'
import { error } from '@exobase/core'
import { compose, toInt } from 'radash'
import { useRouter } from '@exobase/hooks'
import { useNode } from '@exobase/use-node-http'

const server = https.createServer(
  compose(
    useNode(),
    useRouter(router => router
      .on(['GET', 'POST'], '/ping', ping)
      put('/v1/library/book/*/return', returnBook),
      post('/v1/library/book', createBook),
      get('/v1/library/book/*', findBook),
      get('/v1/library/book', listBooks),
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
