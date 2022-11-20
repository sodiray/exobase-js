import type { Handler, Props } from '@exobase/core'
import { isFunction, objectify, parallel } from 'radash'

type ServiceMap<TServices> = {
  -readonly [Key in keyof TServices]:
    | TServices[Key]
    | ((props: Props) => Promise<TServices[Key]>)
    | ((props: Props) => TServices[Key])
}

export async function withServices<TServices, TProps extends Props>(
  func: Handler<TProps & { services: TProps['services'] & TServices }>,
  serviceFunctionsByKey: ServiceMap<TServices>,
  props: TProps
) {
  const serviceList = await parallel(
    10,
    Object.keys(serviceFunctionsByKey) as (keyof ServiceMap<TServices>)[],
    async key => {
      const serviceOrFunction = serviceFunctionsByKey[key]
      return {
        key,
        value: isFunction(serviceOrFunction)
          ? await Promise.resolve(serviceOrFunction(props))
          : serviceOrFunction
      }
    }
  )
  const services = objectify(
    serviceList,
    s => s.key,
    s => s.value
  ) as unknown as TServices

  return await func({
    ...props,
    services: {
      ...props.services,
      ...services
    }
  })
}

export const useServices: <TServices, TProps extends Props = Props>(
  serviceFunctionsByKey: ServiceMap<TServices>
) => (
  func: Handler<TProps & { services: TProps['services'] & TServices }>
) => Handler<TProps> = serviceFunctionsByKey => func => props =>
  withServices(func, serviceFunctionsByKey, props)
