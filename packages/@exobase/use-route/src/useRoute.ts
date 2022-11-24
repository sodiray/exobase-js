import type { Handler, Props, Request } from '@exobase/core'
import { list, max } from 'radash'

export type UseRouteRoute = `/${string}` | '*'
export type UseRouteMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'PATCH'
  | '*'

const zip = <T>(
  listA: readonly T[],
  listB: readonly T[]
): [T | null, T | null][] => {
  const length = max([listA.length, listB.length])
  return list(0, length).reduce((acc, idx) => {
    return [...acc, [listA[idx] ?? null, listB[idx] ?? null]]
  }, [] as [T | null, T | null][])
}

const trim = (str: string | null | undefined, charsToTrim: string = ' ') => {
  if (!str) return ''
  const begin = new RegExp(`^[${charsToTrim}]+?`)
  const end = new RegExp(`[${charsToTrim}]+?$`)
  return str.replace(begin, '').replace(end, '')
}

export const isMatch = (
  request: Pick<Request, 'method' | 'path'>,
  methodRule: UseRouteMethod,
  routeRule: UseRouteRoute
): boolean => {
  // Check method
  if (methodRule !== '*') {
    const isMethodMatch = methodRule === request.method.toUpperCase()
    if (!isMethodMatch) return false
  }
  // Check route
  if (routeRule !== '*') {
    const pathParts = trim(request.path, '/').split('/')
    const ruleParts = trim(routeRule, '/').split('/')
    if (ruleParts.length > pathParts.length) {
      return false
    }
    for (const [rulePart, pathPart] of zip(ruleParts, pathParts)) {
      if (rulePart === '**') return true
      if (rulePart === '*') continue
      if (rulePart !== pathPart) return false
    }
  }
  return true
}

export async function withRoute<TProps extends Props>(
  func: Handler<TProps>,
  methodRule: UseRouteMethod,
  routeRule: UseRouteRoute,
  endpointFunction: Function,
  props: TProps
) {
  if (isMatch(props.request, methodRule, routeRule))
    return await endpointFunction(props)
  return await func(props)
}

export const useRoute: <TProps extends Props>(
  methodRule: UseRouteMethod,
  routeRule: UseRouteRoute,
  endpointFunction: Function
) => (func: Handler<TProps>) => Handler<TProps> =
  (methodRule, routeRule, endpointFunction) => func => props =>
    withRoute(func, methodRule, routeRule, endpointFunction, props)
