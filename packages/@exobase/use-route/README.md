Provides an Exobase hook that will do simple method/route routing to differnet endpoint functions.

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { useRoute } from '@exobase/use-route'

export const listLibraries = async (props: Props) => {
  return db.libraries.list()
}

export const listBooks = async (props: Props) => {
  return db.books.list()
}

export default compose(
  useNext(),
  useRoute('GET', '/library', listLibraries)
  useRoute('GET', '/library/books', listBooks)
  async () => {
    throw new Error('404 Not found')
  }
)
```
