import type { Handler, Props } from '@exobase/core'
import { tryit } from 'radash'

export async function withCatch<TProps extends Props>(
  func: Handler<TProps>,
  handler: (props: TProps, error: any) => any,
  props: TProps
) {
  const [err, result] = await tryit(func)(props)
  return err ? handler(props, err) : result
}

export const useCatch: <TProps extends Props>(
  handler: (props: TProps, error: any) => any
) => (func: Handler<TProps>) => Handler<TProps> = handler => func => props =>
  withCatch(func, handler, props)
