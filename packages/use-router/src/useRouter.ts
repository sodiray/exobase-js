import type { Handler, Props } from '@exobase/core'
import type { Router } from './router'
import { router } from './router'
import type { HttpMethod, HttpPath } from './types'

export async function withRouter<TProps extends Props>(
  func: Handler<TProps>,
  r: Router,
  props: TProps
) {
  const { handler, params } = r.lookup({
    method: props.request.method as HttpMethod,
    path: props.request.path as HttpPath
  })
  if (handler)
    return await handler({
      ...props,
      request: {
        ...props.request,
        params: {
          ...props.request.params,
          ...params
        }
      }
    })
  return await func(props)
}

export const useRouter: <TProps extends Props>(
  routing: (router: Router) => Router
) => (func: Handler<TProps>) => Handler<TProps> = routing => {
  const r = routing(router())
  return func => props => withRouter(func, r, props)
}
