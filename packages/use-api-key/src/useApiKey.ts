import { hook, NotAuthenticatedError, Props } from '@exobase/core'
import { isFunction, tryit } from 'radash'

export type ApiKeyAuth = {
  apiKey: string
}

export const useApiKey = (
  keyOrFunc: string | ((props: Props) => Promise<string>)
) =>
  hook<Props, Props<{}, {}, ApiKeyAuth>>(function useApiKey(func) {
    return async props => {
      const header = props.request.headers['x-api-key'] as string
      if (!header) {
        throw new NotAuthenticatedError('This function requires an api key', {
          key: 'exo.api-key.missing-header'
        })
      }

      // If a `Key ` prefix exists, remove it
      const providedKey = header.replace(/^[Kk]ey\s/, '')
      if (!providedKey) {
        throw new NotAuthenticatedError('Invalid api key', {
          key: 'exo.api-key.missing-key'
        })
      }

      const [err, key] = await tryit(async () => {
        return isFunction(keyOrFunc) ? await keyOrFunc(props) : keyOrFunc
      })()

      if (err) {
        throw new NotAuthenticatedError('Server cannot authenticate', {
          key: 'exo.api-key.key-error'
        })
      }

      if (!key) {
        throw new NotAuthenticatedError('Server cannot authenticate', {
          key: 'exo.api-key.key-not-found'
        })
      }

      if (providedKey !== key) {
        throw new NotAuthenticatedError('Invalid api key', {
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
  })
