Provides an Exobase hook that will parse path params.

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { usePathParams } from '@exobase/use-path-params'

export const findBookById = async (props: Props) => {
  const bookId = props.args.id
  return db.books.find(bookId)
}

export default compose(
  useNext(),
  usePathParams('/library/books/{id}')
  findBookById
)
```
