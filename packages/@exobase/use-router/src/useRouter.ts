import type { Handler, Props } from '@exobase/core'
import type { Router } from './router'
import { createRouter } from './router'
import type { HttpMethod, HttpPath } from './types'

export async function withRouter<TProps extends Props>(
  func: Handler<TProps>,
  router: Router,
  props: TProps
) {
  const handler = router.lookup({
    method: props.request.method as HttpMethod,
    path: props.request.path as HttpPath
  })
  if (handler) return await handler(props)
  return await func(props)
}

export const useRouter: <TProps extends Props>(
  routing: (router: Router) => Router
) => (func: Handler<TProps>) => Handler<TProps> = routing => func => {
  const router = routing(createRouter())
  return props => withRouter(func, router, props)
}
