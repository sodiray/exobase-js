An Exobase init hook that proxies calls to the global standard console functions (log, warn, error, debug) to a logger you specify.

Some engineers or teams may not be a fan of this. Thats ok. This is a hook I (@rayepps) have used a lot and now can't live without. Locally, we use a simple environment variable check to disable the customer logger which gives us beautiful/readable logs as engineers. In production, we have the assurance of knowing that no log can possibly escape our logger because we've proxied the console.log functions.

I highly recommend 👍

## Install

Yarn

```sh
yarn add @exobase/use-init-logger
```

then

```ts
import { useLogger } from '@exobase/use-init-logger'
```

or, install with the hooks package

```sh
yarn add @exobase/hooks
```

then

```ts
import { useLogger, useServices, useJsonArgs, useCors } from '@exobase/hooks'
```

## Usage

This is a hook you'll probably use on every endpoint in the same way so you'll want to compose it in one place with all your logging config. We'll do that below, here's a quick naive implementation of a file logger.

```ts
import { compose, isObject } from 'radash'
import type { Props } from '@exobase/core'
import { useLambda } from '@exobase/lambda'
import { useLogger } from '@exobase/hooks'
import fs from 'fs'

const endpoint = (props: Props) => {
  console.log('This will be sent to the endpoint.log file')
}

export default compose(
  useLogger({
    logger: FileLogger('endpoint.log')
  }),
  useLambda(),
  endpoint
)
```

Here's the file logger

```ts
const FileLogger = (file: string) => {
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

We have deep love for log tail. This is how we use LogTail with the `useLogger` hook. First, we compose the hook in a `hook/useLogger` file in our project so we don't have to do the setup in every endpoint.

```ts
// ~/hooks/useLogger.ts
import { useLogger as exobaseUseLogger } from '@exobase/use-init-logger'

export const useLogger = () =>
  exobaseUseLogger({
    logger: LogTailLogger(),
    awaitFlush: true,
    reuseLogger: true,
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

Lastly, in our endpoint, we import our own `useLogger` instead of the Exobase `useLogger` hook directly.

```ts
import { useLogger } from '~/hooks/useLogger'

export default compose(useLogger(), useLambda(), endpoint)
```
