import { Handler, Props } from './types'

/**
 * A helper function to more easily create hook
 * functions. Encapsulates some of the boiler
 * plate needed to create the hook structure.
 *
 * @example
 * const useCors = () => hook((func, props) => {
 *   return await func(addCorsHeaders(props))
 * })
 */
export function hook<TGivenProps extends Props, TRequiredProps extends Props>(
  fn: (func: Handler<TRequiredProps>, props: TGivenProps) => Promise<any>
) {
  return (func: Handler<TRequiredProps>) => {
    return (props: TGivenProps) => fn(func, props)
  }
}
