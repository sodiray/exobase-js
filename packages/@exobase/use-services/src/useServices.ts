import type { ApiFunction, Props } from '@exobase/core'
import { objectify, parallel, partial } from 'radash'

type ServiceMap<TServices> = {
  -readonly [Key in keyof TServices]:
    | ((props: Props) => Promise<TServices[Key]>)
    | ((props: Props) => TServices[Key])
}

export async function withServices<TServices>(
  func: ApiFunction,
  serviceFunctionsByKey: ServiceMap<TServices>,
  props: Props
) {
  const serviceList = await parallel(
    10,
    Object.keys(serviceFunctionsByKey) as (keyof ServiceMap<TServices>)[],
    async key => {
      const serviceOrFunction = serviceFunctionsByKey[key]
      return {
        key,
        value: await Promise.resolve(serviceOrFunction(props))
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

export const useServices =
  <TServices>(serviceFunctionsByKey: ServiceMap<TServices>) =>
  (func: ApiFunction) =>
    partial(withServices, func, serviceFunctionsByKey)
