import type { AbstractRequest, ApiFunction, Props } from '@exobase/core'
import { partial } from 'radash'

type MethodKey = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | '*'
type RouteKey = `/${string}` | '*'

export const isMatch = (
  request: Pick<AbstractRequest, 'method' | 'path'>,
  methodKey: MethodKey,
  routeKey: RouteKey
): boolean => {
  // Check method
  if (methodKey !== '*') {
    const isMethodMatch = methodKey === request.method.toUpperCase()
    if (!isMethodMatch) return false
  }
  // Check route
  if (routeKey !== '*') {
    const ruleParts = routeKey.split('/')
    const pathParts = request.path.split('/')
    if (ruleParts.length > pathParts.length) {
      return false
    }
    const zipped = ruleParts.map((x, i) => [x, pathParts[i]]) as [
      string,
      string | null
    ][]
    for (const [rulePart, pathPart] of zipped) {
      if (rulePart === '**') return true
      if (rulePart === '*') continue
      if (rulePart !== pathPart) return false
    }
  }
  return true
}

export async function withRoute<TServices>(
  func: ApiFunction,
  methodKey: MethodKey,
  routeKey: RouteKey,
  endpointFunction: Function,
  props: Props
) {
  if (isMatch(props.request, methodKey, routeKey))
    return await endpointFunction(props)
  else return await func(props)
}

export const useRoute =
  (methodKey: MethodKey, routeKey: RouteKey, endpointFunction: Function) =>
  (func: ApiFunction) =>
    partial(withRoute, func, methodKey, routeKey, endpointFunction)
