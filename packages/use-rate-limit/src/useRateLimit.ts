import type { Handler, Props, Request } from '@exobase/core'
import { error } from '@exobase/core'
import type { Duration } from 'durhuman'
import dur from 'durhuman'
import { isFunction, tryit } from 'radash'

export interface IRateLimitStore {
  inc: (
    key: string,
    timestamp: number
  ) => Promise<{
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

export type UseRateLimitOption<TProps extends Props = Props> = {
  /**
   * A string unique to the items you are using this hook to cache.
   * You'll likely want to use a unique key in every endpoint
   */
  key: string
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
}

export async function withRateLimiting<TProps extends Props>(
  func: Handler<TProps>,
  {
    key: prefix,
    window,
    max,
    toIdentity,
    logger,
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
    throw error({
      status: 500,
      message: 'Server error',
      key: 'exo.rate-limit.misconfig'
    })
  }
  const store = await Promise.resolve(
    storeFn ? (isFunction(storeFn) ? storeFn(props) : storeFn) : services.store!
  )
  const [err, record] = await tryit(store.inc)(key, Date.now())
  if (err) {
    logger?.error('[useRateLimit] Error on store.inc', { err, key })
    throw error({
      status: 500,
      message: 'Server error',
      key: 'exo.rate-limit.inc-issue'
    })
  }
  if (!record) {
    logger?.error('[useRateLimit] Store.inc returned nothing', { key })
    throw error({
      status: 500,
      message: 'Server error',
      key: 'exo.rate-limit.inc-empty'
    })
  }
  const { count, timestamp } = record
  const elapsed = Date.now() - timestamp
  const windowHasPassed = elapsed > dur(window, 'milliseconds')
  if (windowHasPassed) {
    await store.reset(key)
  } else {
    if (count > max) {
      logger?.log('[useRateLimit] Rate limit exceeded', {
        key,
        count,
        timestamp,
        max,
        window
      })
      throw error({
        status: 429,
        message: 'Too Many Requests',
        key: 'exo.rate-limit.exceeded'
      })
    }
  }
  return await func(props)
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
