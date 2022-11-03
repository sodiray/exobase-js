import type { AbstractRequest, ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'

export const parsePathParams = (
  request: Pick<AbstractRequest, 'path'>,
  path: string
): Record<string, string> => {
  const badPathError = (extra: { info: string; key: string }) => {
    return error({
      status: 400,
      note: `This function can only be called with a path matching ${path}`,
      ...extra
    })
  }
  const pathParts = request.path.split('/')
  const requiredParts = path.split('/')
  if (pathParts.length !== requiredParts.length) {
    throw badPathError({
      info: 'Endpoint called with invalid path',
      key: 'tk.error.path-param'
    })
  }
  const zipped = requiredParts.map((x, i) => [x, pathParts[i]])
  const params: Record<string, string> = {}
  for (const [requiredPart, pathPart] of zipped) {
    const isVar = requiredPart.match(/^{[^\/]+}$/)
    if (isVar) {
      const name = requiredPart.substring(1, requiredPart.length - 1)
      params[name] = pathPart
      continue
    }
    if (requiredPart !== pathPart) {
      throw badPathError({
        info: 'Endpoint called with invalid path',
        key: 'tk.error.path-param'
      })
    }
  }
  return params
}

export async function withPathParams(
  func: ApiFunction,
  path: string,
  props: Props
) {
  const params = parsePathParams(props.request, path)
  return await func({
    ...props,
    args: {
      ...params
    }
  })
}

export const usePathParams =
  (path: string) => (func: ApiFunction) => (props: Props) =>
    withPathParams(func, path, props)
