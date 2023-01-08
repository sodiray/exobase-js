import type { Handler, Props } from '@exobase/core'
import { isResponse } from '@exobase/core'
import { tryit } from 'radash'

export async function withCatch<TProps extends Props>(
  func: Handler<TProps>,
  handler: (props: TProps, error: null | Error) => any,
  props: TProps
) {
  const [err, result] = await tryit(func)(props)
  const getError = () => {
    if (err) return err
    if (isResponse(result) && result.error) return result.error
    return null
  }
  const error = getError()
  return error ? handler(props, error) : result
}

export const useCatch: <TProps extends Props>(
  handler: (props: TProps, error: null | Error) => any
) => (func: Handler<TProps>) => Handler<TProps> = handler => func => props =>
  withCatch(func, handler, props)
