import type { Handler, Props } from '@exobase/core'
import { isResponse, props } from '@exobase/core'
import { headers } from 'next/headers'
import { tryit } from 'radash'

/**
 *
 * @hook root
 * @example
 * ```ts
 * import { useNextAction } from '@exobase/use-next'
 *
 * const handler = compose(useNextAction(), async () => {
 *
 * })
 * ```
 */
export const useNextAction =
  <TBody extends {}>() =>
  (func: Handler<Props>) =>
  async (body: TBody) => {
    let headerObject: Record<string, string | string[]> = {}
    headers().forEach((value, key) => (headerObject[key] = value))
    const [error, result] = await tryit(func)({
      ...props({
        headers: headerObject,
        url: '/',
        body,
        path: '/',
        method: 'ANY',
        query: {},
        params: {},
        ip: '',
        startedAt: Date.now(),
        protocol: '',
        httpVersion: ''
      }),
      framework: {}
    })
    if (error) {
      if (isResponse(error)) {
        return error.body
      }
    }
    if (isResponse(result)) {
      return result.body
    }
    return result ?? {}
  }
