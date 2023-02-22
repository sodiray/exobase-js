import { Handler, Props } from './types'

/**
 * A helper function to more easily create hook
 * functions. Encapsulates some of the boiler
 * plate needed to create the hook structure.
 *
 * @example
 * const useCors = hook((func, props) => {
 *   return await func(addCorsHeaders(props))
 * })
 */
export function hook<TOptions>(
  init: (func: Handler, props: Props, options: TOptions) => Promise<any>
): (options: TOptions) => (func: Handler) => (props: Props) => Promise<any>

export function hook(
  init: (func: Handler, props: Props) => Promise<any>
): () => (func: Handler) => (props: Props) => Promise<any>

export function hook<TOptions>(
  fn: (func: Handler, props: Props, options: TOptions) => Promise<any>
) {
  return (options: TOptions) => (func: Handler) => {
    return (props: Props) => fn(func, props, options)
  }
}
