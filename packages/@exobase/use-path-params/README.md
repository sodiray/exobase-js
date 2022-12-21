An Exobase hook that validates path parameters in the request.

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { usePathParams } from '@exobase/use-path-params'

export const findBookById = async (props: Props) => {
  return db.books.find(props.args.bookId)
}

export default compose(
  useNext(),
  usePathParams(z => ({
    libraryId: z.string(),
    bookId: z.string().tranform(id => parseInt(id)),
  }))
  findBookById
)
```

when called with

```sh
curl /api/libraries/ny-public-library/books/3328
```

In some cases, you may need to parse the path params first. Sometimes the framework + root hook will do the param parsing. In other cases the `useRouter` hook, if you use it, will do the param parsing. If you're using AWS Lambda (without a router) there is no built in path param utility so you'll need to parse the path params manually using `usePathParamsParser`.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/use-lambda'
import { usePathParamsParser } from '@exobase/use-path-params-parser'
import { usePathParams } from '@exobase/use-path-params'

export const findBookById = async (props: Props) => {
  return db.books.find(props.args.bookId)
}

export default compose(
  useLambda(),
  usePathParamsParser('/libraries/{libraryId}/books/{bookId}'),
  usePathParams(z => ({
    libraryId: z.string(),
    bookId: z.string().tranform(id => parseInt(id)),
  }))
  findBookById
)
```
