import { isFunction, tryit } from 'radash'
import { v4 as uuid } from 'uuid'

type LogFunction = (message?: any, ...optionalParams: any[]) => void
type AsyncFunction = (...args: any[]) => Promise<any>
type LogIntercepter = Awaited<ReturnType<typeof initLogIntercepter>>

declare global {
  var _useConsoleInterceptIntercepter: LogIntercepter
}

export interface Logger {
  log: LogFunction
  error: LogFunction
  warn: LogFunction
  debug: LogFunction
}

export type UseConsoleInterceptOptions = {
  /**
   * Sometimes you want your logger disabled, this
   * is an easy to use flag. Set it to true and no
   * logger setup will be done.
   *
   * @default false
   */
  disable?: boolean
  /**
   * If set to true, after calling the log methods
   * on your logger the related console log method
   * will also be called.
   *
   * @default true
   */
  passthrough?: boolean
  /**
   * For async loggers, if there are any pending log
   * requests we'll await them before returning from
   * the function handler.
   *
   * @default true
   */
  awaitFlush?: boolean
  /**
   * The hook stores the logger/intercepter in the global
   * context and will reuse it instead of creating a new
   * logger. Set this to false to disable this behavior
   * and have the hook re-generate the logger/intercepter
   * on every invocation.
   *
   * @default true
   */
  reuseConsoleIntercept?: boolean
  /**
   * The logger that console log invocations should
   * be dispatched to.
   */
  logger: Logger | Promise<Logger> | (() => Logger | Promise<Logger>)
}

export const initLogIntercepter = async ({
  logger: makeLogger,
  passthrough = true,
  target = console
}: UseConsoleInterceptOptions & {
  target?: typeof console
}) => {
  const queue: Record<string, Promise<any>> = {}
  const logger = await Promise.resolve(
    isFunction(makeLogger) ? makeLogger() : makeLogger
  )

  const intercept = (
    consoleFunc: LogFunction & { __hook?: string },
    loggerFunc: LogFunction
  ): LogFunction => {
    // Check if console log function has already been
    // overriden. In some cases running locally this
    // can happen.
    if (consoleFunc.__hook === 'log.override') {
      return consoleFunc
    }
    function logOverride(...args: any[]) {
      const id = uuid()
      queue[id] = Promise.resolve(loggerFunc.apply(logger, args)).then(
        () => delete queue[id]
      )
      if (passthrough) {
        consoleFunc.apply(target, args)
      }
    }
    // Record on the log function that we've
    // overriden it.
    logOverride.__hook = 'log.override'
    return logOverride
  }

  target.log = intercept(target.log, logger.log)
  target.error = intercept(target.error, logger.error)
  target.warn = intercept(target.warn, logger.warn)
  target.debug = intercept(target.debug, logger.debug)

  return {
    flush: async () => {
      const pending = Object.values(queue)
      if (pending.length > 0) {
        await Promise.allSettled(Object.values(queue))
      }
    }
  }
}

const withLogger = async (
  func: AsyncFunction,
  options: UseConsoleInterceptOptions,
  args: any[]
) => {
  const intercepter = await (async () => {
    if (options.reuseConsoleIntercept) {
      const existing = globalThis._useConsoleInterceptIntercepter
      if (existing) {
        return existing
      }
      const newIntercepter = await initLogIntercepter(options)
      globalThis._useConsoleInterceptIntercepter = newIntercepter
      return newIntercepter
    }
    return await initLogIntercepter(options)
  })()
  const [err, result] = await tryit(func)(...args)
  if (options.awaitFlush ?? true) {
    await intercepter.flush()
  }
  if (err) throw err
  return result
}

export const useConsoleIntercept: (
  options: UseConsoleInterceptOptions
) => (func: AsyncFunction) => AsyncFunction = options => func =>
  options.disable === true ? func : (...args) => withLogger(func, options, args)
