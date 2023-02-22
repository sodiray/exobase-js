# Exobase

<div align="center">
  <p align="center">
    <img src="https://github.com/rayepps/exobase-js/blob/master/banner.png" alt="radash" width="100%" style="border-radius:4px" />
  </p>
</div>
<div>
  <h3 align="center">
    Typescript Framework for Node Web Services &amp; APIs
    <br />
    <h4 align="center">
      <a href="https://exobase-js.vercel.app" target="_blank">
        Full Documentation
      </a>
    </h4>
  </h3>
</div>

## Install

To keep your dependencies lean, Exobase is split into seperate packages for each hook (learn about hooks [here](https://exobase-js.vercel.app/docs/core-concepts#hooks)) + a core package. To install, you have two options.

1. Install everything. This is the easiest way to get started quickly.

```sh
yarn add @exobase/core @exobase/hooks
```

2. Only install what you need. If you only need the `useJsonArgs` and `useCors` hooks then only install those packages.

```sh
yarn add @exobase/use-json-args @exobase/use-cors
```

A lot of thought and effort is put into keeping the hooks small, minimal, and lean. The root hooks however typically depend on the framework libraries so you'll want to make sure you're only installing the specific ones you need.

```sh
yarn add @exobase/use-lambda
yarn add @exobase/use-express
yarn add @exobase/use-next
```

## Getting Started

Using our [Express example project](./examples/callback-api-express) you can have an API running in a few minutes. Here's a simple health check endpoint.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useExpress } from '@exobase/use-express'

export const ping = async ({ args, services }: Props<Args, Services>) => {
  return {
    message: 'pong'
  }
}

export default compose(useExpress(), ping)
```
