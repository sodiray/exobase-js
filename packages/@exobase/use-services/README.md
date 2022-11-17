Provides an Exobase hook that allows for pseudo dependency injection of endpoint function dependencies into the `services` property of the `Props` argument.

## Install

Yarn

```sh
yarn add @exobase/use-services
```

or, if you want to install all hooks:

```sh
yarn add @exobase/hooks
```

## Usage

To keep your endpoint functions easy to test, use the `useServices` hook to pass modules that own the interface to an external resources (database, cache, or a third-party app) as a function argument.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useExpress } from '@exobase/use-express'
import { useServices } from '@exobase/use-services'

type Args = {}
type Services = {
  database: Database
  cache: Cache
  stripe: Stripe
  github: GitHub
}

const setupAccount = ({ services }: Props<Args, Services>) => {
  const { database, cache, stripe, github } = services
  const customer = await database.customers.get()
  const paymentData = await stripe.setup(customer)
  await github.cloneRepository(customer)
  await cache.put(customer)
}

export default compose(
  useExpress(),
  useServices({
    database: () => new Database(),
    cache: () => new Cache(),
    stripe: () => new Stripe(),
    github: () => new GitHub()
  }),
  setupAccount
)
```
