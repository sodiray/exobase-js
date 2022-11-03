import type { ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { isFunction } from 'radash'

type PropsGetter<T> = (props: Props) => Promise<T>

export const unauthorized = (extra: { info: string; key: string }) =>
  error({
    message: 'Not Authenticated',
    status: 401,
    ...extra
  })

export async function withApiKey(
  func: ApiFunction,
  keyFunc: string | PropsGetter<string>,
  props: Props
) {
  const header = props.request.headers['x-api-key'] as string

  const key = !isFunction(keyFunc)
    ? keyFunc
    : await (keyFunc as PropsGetter<string>)(props)

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

  return await func(props)
}

export const useApiKey =
  (key: string | PropsGetter<string>) =>
  (func: ApiFunction) =>
  (props: Props) =>
    withApiKey(func, key, props)
