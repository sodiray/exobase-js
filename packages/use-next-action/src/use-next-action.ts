import type { NextFunc, Props } from '@exobase/core'
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
  (func: NextFunc<Props>) =>
  async (body: TBody) =>
    withNextAction(func, body, () => {
      let headerObject: Record<string, string> = {}
      headers().forEach(
        (value: string, key: string) => (headerObject[key] = value)
      )
      return headerObject
    })

export const withNextAction = async (
  func: NextFunc<Props>,
  body: any,
  getHeaders: () => Record<string, string>
) => {
  const [error, result] = await tryit(func)({
    ...props({
      headers: getHeaders(),
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
