import type { Handler, Props, Request } from '@exobase/core'

export type UseRouteMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'PATCH'
  | '*'
export type UseRouteRoute = `/${string}` | '*'

export const isMatch = (
  request: Pick<Request, 'method' | 'path'>,
  methodKey: UseRouteMethod,
  routeKey: UseRouteRoute
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
  methodKey: UseRouteMethod,
  routeKey: UseRouteRoute,
  endpointFunction: Function,
  props: TProps
) {
  if (isMatch(props.request, methodKey, routeKey))
    return await endpointFunction(props)
  else return await func(props)
}

export const useRoute: <TProps extends Props>(
  methodKey: UseRouteMethod,
  routeKey: UseRouteRoute,
  endpointFunction: Function
) => (func: Handler<TProps>) => Handler<TProps> =
  (methodKey, routeKey, endpointFunction) => func => props =>
    withRoute(func, methodKey, routeKey, endpointFunction, props)
