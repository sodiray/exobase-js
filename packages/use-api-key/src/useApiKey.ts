import type { Handler, Props } from '@exobase/core'
import { NotAuthenticatedError } from '@exobase/core'
import { isFunction, tryit } from 'radash'

export type ApiKeyAuth = {
  apiKey: string
}

export async function withApiKey<TProps extends Props>(
  func: Handler<TProps & { auth: TProps['auth'] & ApiKeyAuth }>,
  keyFunc: string | ((props: TProps) => Promise<string>),
  props: TProps
) {
  const header = props.request.headers['x-api-key'] as string
  if (!header) {
    throw new NotAuthenticatedError({
      info: 'This function requires an api key',
      key: 'exo.api-key.missing-header'
    })
  }

  // If a `Key ` prefix exists, remove it
  const providedKey = header.replace(/^[Kk]ey\s/, '')
  if (!providedKey) {
    throw new NotAuthenticatedError({
      info: 'Invalid api key',
      key: 'exo.api-key.missing-key'
    })
  }

  const [err, key] = await tryit(async () => {
    return isFunction(keyFunc) ? await keyFunc(props) : keyFunc
  })()

  if (err) {
    throw new NotAuthenticatedError({
      info: 'Server cannot authenticate',
      key: 'exo.api-key.key-error'
    })
  }

  if (!key) {
    throw new NotAuthenticatedError({
      info: 'Server cannot authenticate',
      key: 'exo.api-key.key-not-found'
    })
  }

  if (providedKey !== key) {
    throw new NotAuthenticatedError({
      info: 'Invalid api key',
      key: 'exo.api-key.mismatch'
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
  keyOrFunc: string | ((props: TProps) => Promise<string>)
) => (
  func: Handler<TProps & { auth: TProps['auth'] & ApiKeyAuth }>
) => Handler<TProps> = keyOrFunc => func => props =>
  withApiKey(func, keyOrFunc, props)
