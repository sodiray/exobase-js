import type { NextFunc, Props } from '@exobase/core'
import { isFunction, objectify, parallel } from 'radash'

type ServiceMap<TServices extends {} = {}> = {
  -readonly [Key in keyof TServices]:
    | TServices[Key]
    | Promise<TServices[Key]>
    | ((props: Props) => Promise<TServices[Key]>)
    | ((props: Props) => TServices[Key])
}

type ResolveServiceMap<TServiceMap> = {
  [Key in keyof TServiceMap]: TServiceMap[Key] extends Promise<infer R>
    ? R
    : TServiceMap[Key] extends (props: Props) => Promise<infer R>
    ? R
    : TServiceMap[Key] extends (props: Props) => infer R
    ? R
    : TServiceMap[Key]
}

export async function withServices(
  func: NextFunc<Props>,
  serviceFunctionsByKey: Record<string, any>,
  props: Props
) {
  const serviceList = await parallel(
    10,
    Object.keys(serviceFunctionsByKey),
    async key => {
      const serviceOrFunction = serviceFunctionsByKey[key]
      return {
        key,
        value: await Promise.resolve(
          isFunction(serviceOrFunction)
            ? serviceOrFunction(props)
            : serviceOrFunction
        )
      }
    }
  )
  const services = objectify(
    serviceList,
    s => s.key,
    s => s.value
  )

  return await func({
    ...props,
    services: {
      ...props.services,
      ...services
    }
  })
}

export const useServices: <TServiceMap extends ServiceMap<{}>>(
  serviceFunctionsByKey: TServiceMap
) => (
  func: NextFunc<Props<{}, ResolveServiceMap<TServiceMap>>>
) => NextFunc<Props> = serviceFunctionsByKey => func => props =>
  withServices(func as NextFunc<Props>, serviceFunctionsByKey, props)
