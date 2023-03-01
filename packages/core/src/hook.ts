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

/**
 * A helper function to more easily create a
 * root hook function. Encapsulates some of
 * the boiler plate needed to create the root
 * hook structure.
 *
 * @example
 * const useExpress = () => root((func, req, res) => {
 *   const props = createProps(req)
 *   const result = await func(props)
 *   return applyResult(result, res)
 * })
 */
export function root<TRequiredProps extends Props, TArgs>(
  fn: (func: Handler<TRequiredProps>, ...args: TArgs[]) => Promise<any>
) {
  return (func: Handler<TRequiredProps>) => {
    return (...args: TArgs[]) => fn(func, ...args)
  }
}

/**
 * A helper function to more easily create a
 * init hook function. Encapsulates some of
 * the boiler plate needed to create the init
 * hook structure.
 *
 * @example
 * const useInitLogger = () => init((func, ...args) => {
 *   console.log = () => { ... }
 *   return await func(...args)
 * })
 */
export function init<TArgs = any>(
  fn: (func: Function, ...args: TArgs[]) => Promise<any>
) {
  return (func: Function) => {
    return (...args: TArgs[]) => fn(func, ...args)
  }
}
