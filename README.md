# Exobase

> Be an outsider, rebel against the frameworks that control your code. Stay nimble.

Exobase is an implementation of the Abstract & Compose design pattern, you'll use it to create APIs and backend web services.

## Installation

Exobase is split into a tiny core package and then one package for each hook (learn about hooks here). You'll always need to install at least two packages:

1. First, you'll need that tiny core packages:

```sh
yarn add @exobase/core
```

2. Second, you'll want the root hook that will act like a hypervisor for the framework you're running on. _i.e. if you're running on Express, you'll need to install the express root hook_ `@exobase/use-express`)

```sh
yarn add @exobase/use-express
yarn add @exobase/use-lambda
yarn add @exobase/use-next
```

3. Optionally, you can install any number of helpful Exobase hooks.

```sh
yarn add @exobase/use-validation
yarn add @exobase/use-jwt-auth
yarn add @exobase/use-api-key-auth
yarn add @exobase/use-basic-auth
yarn add @exobase/use-cors
yarn add @exobase/use-path-params
yarn add @exobase/use-route
```

> If you don't want to deal with a bunch of packages you can install `exobase-hooks` with `yarn add exobase-hooks` which provides all of the hook packages in one.

See the packages section below for a list of all the packages available and how to use them.

## Getting Started

I'll assume our API is using Serverless + AWS Lambda because thats probably the easiest to get started with. Using our Serverless + AWS Lambda example project you can have an API running on your maching in a few minutes.

Here's the most basic ping (or health check) endpoint.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/use-next'

export const ping = async ({ args, services }: Props<Args, Services>) => {
  return {
    message: 'pong'
  }
}

export default compose(useNext(), ping)
```

## Packages

See packages in the `/packages` directory. To see how they're used in the wild, look at the code in the example projects.

| Name                       | Type      | Hooks                                                        | Description                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------- | --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@exobase/core`            | core      |                                                              | The core Exobase package, always required                                                                                                                                                                                                                                                                                                                                     |
| `@exobase/use-api-key`     | hook      | `useApiKey`                                                  | Provides an api key validation hook to implement auth using an api key                                                                                                                                                                                                                                                                                                        |
| `@exobase/use-basic-auth`  | hook      | `useBasicAuth`                                               | Provides a hook that implements basic auth, requiring a valid auth header                                                                                                                                                                                                                                                                                                     |
| `@exobase/use-cors`        | hook      | `useCors`                                                    | Provides a hook that will respond to OPTIONS requests with the appropriate cors headers                                                                                                                                                                                                                                                                                       |
| `@exobase/use-path-params` | hook      | `usePathParams`                                              | Provides a hook that will parse out path parameters into args given a route key to do matching                                                                                                                                                                                                                                                                                |
| `@exobase/use-route`       | hook      | `useRoute`                                                   | Provides a hook that will route one incoming request to a maching function composition by method + path key. _NOTE: This is a bit of a Exobase antipattern but it's needed for APIs on frameworks that offer less control of the file system. NextJS is the best example, you can't have different files for differnent methods, you have to do the routing inside the file._ |
| `@exobase/use-services`    | hook      | `useServices`                                                | Provides a hook that, in simple terms, does dependency injection by applying dependent services to the `props.services` attribute during the request execution.                                                                                                                                                                                                               |
| `@exobase/use-validation`  | hook      | `useValidation` `useJsonArgs` `useQueryArgs` `useHeaderArgs` | Provides hooks that do request validation.                                                                                                                                                                                                                                                                                                                                    |
| `@exobase/use-express`     | root hook | `useExpress`                                                 | Provides a root hook that will handle incoming requests from the Express framework, execute the function chain, and apply the result back to the Express framework.                                                                                                                                                                                                           |
| `@exobase/use-next`        | root hook | `useNext`                                                    | Provides a root hook that will handle incoming requests from the NextJS framework, execute the function chain, and apply the result back to the NextJS framework.                                                                                                                                                                                                             |
| `@exobase/use-lambda`      | root hook | `useLambda`                                                  | Provides a root hook that will handle incoming requests from the AWS Lambda framework, execute the function chain, and apply the result back to the AWS Lambda framework.                                                                                                                                                                                                     |

## Core Concepts

These concepts are mostly synonymous with the Abstract & Compose design pattern. However, the pattern is a general guide and some specific implementation details are decided by Exobase.

### Composing

Typically, I use [Radash's](https://github.com/rayepps/radash) `compose` function. If your not already using Radash and you don't want to install another dependancy, the compose function is only two lines to implement yourself.

```ts
export const compose = (...funcs: Function[]) => {
  return funcs.reverse().reduce((acc, fn) => fn(acc))
}
```

### Hooks

Hooks are the functions we use to compose endpoints. All hooks follow the `Hooks` shape.

```ts
type Hook = (options?) => (func) => (props: Props) => Promise<Response | any>
```

A hook should do work, optionally extend the props, call the next function in the composition, optionally do work on the response, and return the response.

```ts
import { v4 as uuid } from 'uuid'

const useRequestId = () => func => async (props: Props) => {
  return await func({
    ...props,
    args: {
      ...props.args,
      requestId: uuid()
    }
  })
}
```

### Root Hooks

Root hooks are the hooks that abstract the framework. They're function shape is very similar to the `Hook` shape but they don't accept or return `Props`. The root hook is responsible for generating the `Props` object and passing it into the function composition.

```ts
type RootHook = (
  options?
) => (func) => (...args: FrameworkArgs) => Promise<FrameworkResponse>
```

Here's an abbreviated version of the `useExpress` root hook as an example.

```ts
const useExpress = () => func => async (req, res) => {
  const props = createProps(req)
  const result = await fund(props)
  res.json(result)
}
```

Every root hook must

- map the framework arguments (`(req, res)` for the `useExpress` hook) to the standard `Props` interface
- execute the function composition, passing the props object
- apply or return the result of the function to the framework. For `useExpress`, there is no return, the result is applied as a side-effect to the `res` object.

### Init Hooks

There is one more class of hook that can be used before the root hook to do setup work.

```ts
type InitHook = (options?) => (func) => (...args: any[]) => Promise<any>
```

An init hook should take in `...args: any[]` and pass them on to the function composition. It's important that init hooks do not do any framework specific work.

```ts
const useLogger =
  () =>
  func =>
  async (...args: any[]) => {
    const originalConsoleLog = console.log.bind(console)
    console.log = (...log: any[]) => {
      // custom logging logic
      originalConsoleLog(...log)
    }
    return await func(...args)
  }
```

### Endpoint Functions

In any function composition, the endpoint function is the last function. You can think of it like the _final hook_ because it shares the `Hook` argument of `Props`.

```ts
type Endpoint = (props: Props) => Promise<any | Response>
```

Your endpoint function will often specify `Args`, `Services`, and `Auth` types to the generic `Props` interface.

```ts
type Args = {
  username: string
  password: string
}

type Services = {
  db: Database
}

type Response = {
  token: string
  user: User
}

const endpoint = async ({
  args,
  services
}: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const { username, password } = args
  // do login logic
  // return Response object
}
```

I find it's helpful to create a `Response` type, not only for the sake of clarity to readers, but also to help enforce your endpoint function is always returning the response you expect.
