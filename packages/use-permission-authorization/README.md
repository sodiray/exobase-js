---
title: 'usePermissionAuthorization'
description: 'A permission authorization hook'
group: 'Hooks'
badge: 'Auth'
---

Exobase hook to check if a request is authorized given the permissions that are attatched to it.

## Install

```sh
yarn add @exobase/use-permission-authorization
# or
yarn add @exobase/hooks
```

## Import

```ts
import { usePermissionAuthorization } from '@exobase/use-permission-authorization'
// or
import { usePermissionAuthorization } from '@exobase/hooks'
```

## Usage

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'
import { usePermissionAuthorization, useTokenAuth } from '@exobase/hooks'
import type { TokenAuth } from '@exobase/hooks'

type Args = {
  id: string
  price: number
}

type Services = {
  db: Database
}

export const updateListing = async ({
  args,
  services
}: Props<Args, Services, TokenAuth>) => {
  const { id, price } = args
  const { db } = services
  await db.listings.update(id, { price })
}

export default compose(
  useNext(),
  useJsonBody(z => ({
    id: z.string(),
    price: z.number()
  })),
  useTokenAuth(config.auth.tokens.secret),
  usePermissionAuthorization<Props<Args, {}, TokenAuth>>({
    permissions: ({ auth }) => auth.token.permissions,
    require: ({ args }) => `allow::write::com.craigslist/listings/${args.id}`
  }),
  useServices<Services>({
    db: () => new Database()
  })
  updateListing
)
```

## CANI

This hook includes it's own permission engine. It uses a URI prefix trie to check if a user has the required permissions. Every permission has 3 parts and an optional name (helpful to use on endpoints for better errors and DX).

```ts
export type Permission = {
  acl: 'allow' | 'deny'
  scope: string
  uri: string
  name: string | null
}
```

### ACL

Most permissions will have an `acl` of allow, if you want to give a user an anti-permisson (one that restricts their ability) give it an `acl` of `'deny'`.

### Scope

The scope is anything you like, we typically use values like `read`, `write`, or `edit`. Use the `*` value as a wildcard. If a user has the `*` scope on the required resource it will pass verification, no matter the required scope.

### Uri

A forward slash seperated string, or path, to the unique resource. Use the `*` value as a wildcard. We like to start the path with the domain of the site were working on.

```
github/owner/rayepps/repo/exobase-js
github/owner/rayepps/repo/exobase-js/settings
github/owner/rayepps/repo/*/*
```

similar, but simplified:

```
github/rayepps/exobase-js
github/rayepps/exobase-js/settings
github/rayepps/*/*
```

Using github as an example you'll notice the `uri` is very similar to the github url. Thats sort of the idea. In the same way a url is a unique path to a resource, the `uri` should be too.

## Example Permissions

```ts
import cani from '@exobase/use-permission-authorization/cani'
import type { PermissionKey } from '@exobase/use-permission-authorization'

const permissions: PermissionKey[] = [
  // Basic github user abilities
  'allow::create::github/repo',
  'allow::create::github/gist',

  // God mode access to the repos I own
  'allow::*::github/rayepps/*',
  'allow::*::github/rayepps/*/settings',

  // Contributor access to some others
  'allow::contribute::github/vercel/ms',
  'allow::contribute::github/meta/react',

  // My payment failed so my ability to
  // create new repos has been taken away
  // -- overrides the allow above
  // -- order does not matter
  'deny::create::github/repo'
]

const user = cani.user(permissions)

user.has('allow::configure::github/rayepps/exobase-js') // => true
user.has('allow::configure::github/meta/react') // => true
user.has('allow::read::github/meta/react/settings') // => false
user.has('allow::create::github/repo') // => false
```

> This can look very differnet depending on how you implement it. Cani is simple but robust. Your URIs can be as deep or shallow as your use case requires. Your scopes can be as general or as broad as you need.

## Props Changes

When using `usePermissionAuthorization` a service is added called `cani`. You can use this to do more permission checks on the user inside your endpoint or deeper (we don't recommend deeper per good design). You can also import the raw `cani` function from this module but the one attached to the services in the props has already built the URI prefix trie for the current users specific permission set and won't need to build it again (i.e. it's much faster)

```ts
import { useLambda } from '@exobase/use-lambda'
import { useTokenAuth, usePermissionAuthorization } from '@exobase/hooks'
import type { Cani } from '@exobase/hooks'

type Services = {
  cani: Cani
}

const endpoint = async ({ services }: Props<{}, Services>) => {
  const { cani } = services
  if (cani('allow::read::com.github/rayepps/exobase-js/setting')) {
    return db.settings.read()
  }
}

// Using usePermissionAuthorization without the `require`
// option will always pass the authorization check.
// You can use `cani` in your endpoint to do your
// own checks.
export default compose(
  useLambda(),
  useTokanAuth('my-little-secret'),
  usePermissionAuthorization({
    permissions: ({ auth }) => auth.token.permissions
  }),
  endpoint
)
```
