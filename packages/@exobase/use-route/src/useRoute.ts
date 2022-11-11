import type { Handler, Props, Request } from '@exobase/core'

type MethodKey = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | '*'
type RouteKey = `/${string}` | '*'

export const isMatch = (
  request: Pick<Request, 'method' | 'path'>,
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

export async function withRoute<TProps extends Props>(
  func: Handler<TProps>,
  methodKey: MethodKey,
  routeKey: RouteKey,
  endpointFunction: Function,
  props: TProps
) {
  if (isMatch(props.request, methodKey, routeKey))
    return await endpointFunction(props)
  else return await func(props)
}

export const useRoute: <TProps extends Props>(
  methodKey: MethodKey,
  routeKey: RouteKey,
  endpointFunction: Function
) => (func: Handler<TProps>) => Handler<TProps> =
  (methodKey, routeKey, endpointFunction) => func => props =>
    withRoute(func, methodKey, routeKey, endpointFunction, props)
