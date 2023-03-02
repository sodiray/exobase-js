import { Hook, Props } from './types'

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
export function hook<
  TGivenProps extends Props = Props,
  TProducedProps extends Props = Props
>(fn: Hook<TGivenProps, TProducedProps>) {
  return fn
}
