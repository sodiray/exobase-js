import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { isFunction } from 'radash'

type PropsGetter<TProps extends Props, TResult> = (
  props: TProps
) => Promise<TResult>

export type ApiKeyAuth = {
  apiKey: string
}

const unauthorized = (extra: { info: string; key: string }) =>
  error({
    message: 'Not Authenticated',
    status: 401,
    ...extra
  })

export async function withApiKey<TProps extends Props>(
  func: Handler<TProps & { auth: TProps['auth'] & ApiKeyAuth }>,
  keyFunc: string | PropsGetter<TProps, string>,
  props: TProps
) {
  const header = props.request.headers['x-api-key'] as string

  const key = !isFunction(keyFunc)
    ? keyFunc
    : await (keyFunc as PropsGetter<TProps, string>)(props)

  if (!header) {
    throw unauthorized({
      info: 'This function requires an api key',
      key: 'exo.err.core.auth.canes-venarias'
    })
  }

  const providedKey = header.startsWith('Key ') && header.replace('Key ', '')

  if (!key || !providedKey || providedKey !== key) {
    throw unauthorized({
      info: 'Invalid api key',
      key: 'exo.err.core.auth.balefeign'
    })
  }

  return await func({
    ...props,
    auth: {
      ...props.auth,
      apiKey: providedKey
    }
  })
}

export const useApiKey: <TProps extends Props>(
  keyOrFunc: string | PropsGetter<TProps, string>
) => (
  func: Handler<TProps & { auth: TProps['auth'] & ApiKeyAuth }>
) => Handler<TProps> = keyOrFunc => func => props =>
  withApiKey(func, keyOrFunc, props)
