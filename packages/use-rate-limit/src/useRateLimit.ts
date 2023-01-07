import {
  ApiError,
  Handler,
  Props,
  Request,
  Response,
  response
} from '@exobase/core'
import type { Duration } from 'durhuman'
import dur from 'durhuman'
import { isFunction, tryit } from 'radash'

export interface IRateLimitStore {
  /**
   * A function that should incrament the currently stored
   * number of requests in the current window and return
   * both the total number of requests made in the current
   * window and the beginning timestamp of the window.
   */
  inc: (key: string) => Promise<{
    count: number
    timestamp: number
  }>
  reset: (key: string) => Promise<void>
}

export interface IRateLimitLogger {
  log: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
}

export type UseRateLimitLimit = {
  /**
   * Time to live: The amount of time before we should consider an
   * item in the cache to be fresh. The hook will ignore an item in
   * the cache if the TTL has passed.
   */
  window: Duration
  /**
   * The maximum number of requests allowed for a single identity
   * during the window.
   */
  max: number
}

export type UseRateLimitOption<TProps extends Props = Props> = {
  /**
   * A string unique to the items you are using this hook to cache.
   * You'll likely want to use a unique key in every endpoint
   */
  key: string
  limit:
    | UseRateLimitLimit
    | ((props: TProps) => UseRateLimitLimit | Promise<UseRateLimitLimit>)
  /**
   * A mapping function to convert the args into an object that should
   * be used to generate the cache key.
   */
  toIdentity: (props: TProps) => string
  /**
   * If passed, the hook will log information about the caching using
   * this object. If nothing is passed the hook will be silent.
   */
  logger?: IRateLimitLogger
  /**
   * An optional function telling the rate limit hook
   * where to get the store object.
   */
  store?:
    | IRateLimitStore
    | ((props: TProps) => IRateLimitStore | Promise<IRateLimitStore>)
  /**
   * Strict tells the rate limit hook if it should return an error
   * to the user when an error is thrown while interacting with
   * the store. If strict is false, errors will be ignored and the
   * will be called.
   */
  strict?: boolean
}

export async function withRateLimiting<TProps extends Props>(
  func: Handler<TProps>,
  {
    key: prefix,
    limit: limitFn,
    toIdentity,
    logger,
    strict = true,
    store: storeFn
  }: UseRateLimitOption<TProps>,
  props: TProps
) {
  const key = `${prefix}.${toIdentity(props)}`
  const services = props.services as { store?: IRateLimitStore }
  if (!storeFn && !services.store) {
    logger?.error(
      '[useRateLimit] Misconfigured, a store must be passed either in the services or options',
      {
        options: { store: storeFn },
        services: { store: services.store }
      }
    )
    throw new ApiError({
      status: 500,
      message: 'Server error',
      key: 'exo.rate-limit.misconfig'
    })
  }
  const limit = await Promise.resolve(
    isFunction(limitFn) ? limitFn(props) : limitFn
  )
  const store = await Promise.resolve(
    storeFn ? (isFunction(storeFn) ? storeFn(props) : storeFn) : services.store!
  )
  const [err, record] = await tryit(store.inc)(key)
  if (err) {
    logger?.error('[useRateLimit] Error on store.inc', { err, key })
    if (strict === false) return await func(props)
    throw new ApiError({
      status: 500,
      message: 'Server error',
      key: 'exo.rate-limit.inc-issue'
    })
  }
  if (!record) {
    logger?.error('[useRateLimit] Store.inc returned nothing', { key })
    if (strict === false) return await func(props)
    throw new ApiError({
      status: 500,
      message: 'Server error',
      key: 'exo.rate-limit.inc-empty'
    })
  }
  const { count, timestamp } = record
  const elapsed = Date.now() - timestamp
  const windowHasPassed = elapsed > dur(limit.window, 'milliseconds')

  const headers = {
    'X-RateLimit-Limit': `${limit.max}`,
    'X-RateLimit-Remaining': `${limit.max - count}`,
    'X-RateLimit-Reset': `${dur(limit.window, 'milliseconds') - elapsed}`
  }

  if (windowHasPassed) {
    await store.reset(key)
  } else {
    if (count > limit.max) {
      logger?.log('[useRateLimit] Rate limit exceeded', {
        key,
        count,
        timestamp,
        max: limit.max,
        window: limit.window
      })
      throw new ApiError(
        {
          message: 'Too Many Requests',
          status: 429,
          key: 'exo.rate-limit.exceeded'
        },
        {
          status: 429,
          headers
        }
      )
    }
  }
  const [error, result] = await tryit(func)(props)
  const res = response(error, result)
  const responseWithHeaders: Response = {
    ...res,
    headers: {
      ...res.headers,
      ...headers
    }
  }
  return responseWithHeaders
}

export const useRateLimit: <
  TArgs extends {},
  TServices extends {
    store?: IRateLimitStore
  },
  TAuth extends {},
  TRequest extends Request,
  TFramework extends {}
>(
  options: UseRateLimitOption<
    Props<TArgs, TServices, TAuth, TRequest, TFramework>
  >
) => (
  func: Handler<Props<TArgs, TServices, TAuth, TRequest, TFramework>>
) => Handler<Props<TArgs, TServices, TAuth, TRequest, TFramework>> =
  options => func => props =>
    withRateLimiting(func, options, props)
