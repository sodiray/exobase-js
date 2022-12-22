An Exobase init hook that intercepts calls made to the console functions (log, warn, error, debug) and proxies them to a logger you specify.

Some engineers or teams may aginst this. Thats ok! This is a hook I (@rayepps) have used a lot and it's worked incredibly well. Locally, we use a simple environment variable check to disable the intercept which gives us beautiful/readable logs in our terminals. In production, we have the assurance of knowing that no log can possibly escape our logger because we've proxied the console.log functions directly.

I highly recommend 👍

## Install

```sh
yarn add @exobase/use-console-intercept
# or
yarn add @exobase/hooks
```

## Import

```ts
import { useConsoleIntercept } from '@exobase/use-console-intercept'
// or
import { useConsoleIntercept } from '@exobase/hooks'
```

## Usage

This is a hook you'll probably use on every endpoint in the same way so you'll want to compose it in one place with all your logging config. We'll do that below, here's a quick naive implementation of a file logger.

```ts
import { compose, isObject } from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/lambda'
import { useConsoleIntercept } from '@exobase/hooks'
import fs from 'fs'

const endpoint = (props: Props) => {
  console.log('This will be sent to the endpoint.log file')
}

export default compose(
  useConsoleIntercept({
    logger: JsonFileLogger('endpoint.log')
  }),
  useLambda(),
  endpoint
)
```

Here's the `JsonFileLogger` logger

```ts
const JsonFileLogger = (file: string) => {
  const stream = fs.createWriteStream(file, { flags: 'a' })
  const log =
    (level: 'log' | 'warn' | 'error' | 'debug') =>
    (...args: any[]) => {
      const message = args.reduce(
        (acc, arg) =>
          isObject(arg)
            ? { ...acc, ...arg }
            : { ...acc, message: `${arg.message} ${arg}` },
        { message: '', level: level.toUpperCase() }
      )
      stream.write(JSON.stringify(message))
    }
  return {
    log: log('log'),
    warn: log('warn'),
    error: log('error'),
    debug: log('debug')
  }
}
```

### LogTail Example

We have deep love for LogTail. This is how we use LogTail with the `useConsoleIntercept` hook. First, we compose the hook in a `hook/useConsoleIntercept` file in our project so we don't have to do the setup in every endpoint.

```ts
// ~/hooks/useIntercept.ts
import { useConsoleIntercept } from '@exobase/use-console-intercept'

export const useIntercept = () =>
  useConsoleIntercept({
    logger: LogTailLogger(),
    awaitFlush: true,
    reuseConsoleIntercept: true,
    passthrough: true,
    disable: process.env.ENV_NAME === 'local'
  })
```

Here's the `LogTailLogger`.

```ts
import { Logtail } from '@logtail/node'
import config from '~/config'

const LogTailLogger = () => {
  const tail = new Logtail(config.logtail.token, {
    batchSize: 2,
    batchInterval: 15
  })
  return {
    log: tail.log.bind(tail),
    warn: tail.warn.bind(tail),
    error: tail.error.bind(tail),
    debug: tail.debug.bind(tail)
  }
}
```

Lastly, in our endpoint, we import our own `useIntercept` instead of the Exobase `useConsoleIntercept` hook directly.

```ts
import { useIntercept } from '~/hooks/useIntercept'

export default compose(useIntercept(), useLambda(), endpoint)
```
