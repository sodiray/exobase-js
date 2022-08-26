# Exobase

> A library that implements the Abstract & Compose design pattern.

## Getting Started
If you want to spin up an API endpoint here's the quickest way to go.

1. Install the core and hooks packages. We'll also install radash to use the `compose` function.

```sh
yarn add radash @exobase/core
```

2. You need at least one root hook to run on a specific framework. Exobase currently provides a root hook for AWS Lambda, Express, and NextJS. Install the one you want to use.

```sh
yarn add @exobase/lambda
yarn add @exobase/express
yarn add @exobase/next
```

3. I'll assume our API is using NextJS because thats probably the easiest to get started with. We have all the dependencies we need, we can create an api endpoint.

```ts
import { compose } from 'radash'
import type { Props } from '@exobase/core'
import { useNext } from '@exobase/next'

export const ping = async ({ args, services }: Props<Args, Services>) => {
  return {
    message: 'pong'
  }
}

export default compose(
  useNext(),
  ping
)
```

## Packages

See packages in the `/packages` directory.

- The `@exobase/core` package provides the Props type, a functional structure for errors, and a utility for parsing results returned from endpoint functions. It's three files. You could install core only and write your own hooks.
- The `@exobase/hooks` package provides commonly used hooks to do  CORS, query validation, json validation, header validation, and dependency inversion.
- The `@exobase/auth` package provides hooks and models useful for wiring up your own authentication.
- The `@exobase/next` package provides the NextJS root hook useNext that abstracts the NextJS framework.
- The `@exobase/lambda` package provides the AWS Lambda root hook useLambda that abstracts the AWS Lambda framework.
- The `@exobase/express` package provides the ExpressJS root hook useExpress that abstracts the ExpressJS framework

## Core Concepts
These concepts are mostly synonymous with the Abstract & Compose design pattern. However, the pattern is a general guide and many implementation details are decided by Exobase.

### Composing
Typically, I use [Radash's](https://github.com/rayepps/radash) `compose` function. If your not already using Radash and you don't want to install another, the compose function is only two lines to implement yourself.

```ts
export const compose = (...funcs: Function[]) => {
  return funcs.reverse().reduce((acc, fn) => fn(acc))
}
```

### Hooks
Hooks are the functions we use to compose endpoints. All hooks follow the `Hooks` shape.

```ts
type Hook = (options?) => (func) => (props: Props) => Promise<any | Response>
```

A hook should do work, optionally extend the props, call the next function in the composition, optionally do work on the response, and return the response.

```ts
import { v4 as uuid } from 'uuid'

const useRequestId = () => (func) => async (props: Props) => {
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
type RootHook = (options?) => (func) => (...args: FrameworkArgs) => Promise<FrameworkResponse>
```

Here's an abbreviated version of the `useExpress` root hook as an example.

```ts
const useExpress = () => (func) => async (req, res) => {
  const props = initProps(req)
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
const useLogger = () => (func) => async (...args: any[]) => {
  console.log = (...log: any[]) => {
    // custom logging logic
  }
  return await func(...args)
}
```

### Endpoint Functions
In an Exobase function composition, the endpoint function is always the last function. You can think of it like the _final hook_ because it shares the `Hook` argument of `Props`.

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

const endpoint = async ({ args, services }: Props<Args, Services>): Promise<Response> => {
  const { db } = services
  const { username, password } = args
  // do login logic
  // return Response object
}
```

I find it's helpful to create a `Response` type, not only for the sake of clarity to readers, but also to help enforce your endpoint function is always returning the response you expect.