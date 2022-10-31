import type { AbstractRequest, ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { partial, partob } from 'radash'

export const parsePathParams = (
  request: Pick<AbstractRequest, 'path'>,
  path: string
): Record<string, string> => {
  const badPathError = partob(error, {
    cause: 'BAD_PATH_PARAMATER',
    status: 400,
    note: `This function can only be called with a path matching ${path}`
  })
  const pathParts = request.path.split('/')
  const requiredParts = path.split('/')
  if (pathParts.length !== requiredParts.length) {
    throw badPathError({
      key: 'tk.error.path-param',
      message: 'Endpoint called with invalid path'
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
        key: 'tk.error.path-param',
        message: 'Endpoint called with invalid path'
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

export const usePathParams = (path: string) => (func: ApiFunction) => {
  return partial(withPathParams, func, path)
}
