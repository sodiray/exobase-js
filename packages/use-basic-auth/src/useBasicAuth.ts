import { Handler, NotAuthenticatedError, Props } from '@exobase/core'

export type BasicAuth = {
  clientId: string
  clientSecret: string
}

export async function withBasicAuth<TProps extends Props>(
  func: Handler<TProps & { auth: TProps['auth'] & BasicAuth }>,
  props: TProps
) {
  const header = props.request.headers['authorization'] as string
  if (!header) {
    throw new NotAuthenticatedError(
      'This function requires authentication via a token',
      {
        key: 'exo.err.basic.noheader'
      }
    )
  }

  const basicToken = header.startsWith('Basic ') && header.replace('Basic ', '')
  if (!basicToken) {
    throw new NotAuthenticatedError(
      'This function requires authentication via a token',
      {
        key: 'exo.err.basic.nobasic'
      }
    )
  }

  const [clientId, clientSecret] = Buffer.from(basicToken, 'base64')
    .toString()
    .split(':')

  if (!clientId || !clientSecret) {
    throw new NotAuthenticatedError(
      'Cannot call this function without a valid authentication token',
      {
        key: 'exo.err.basic.misformat'
      }
    )
  }

  return await func({
    ...props,
    auth: {
      ...props.auth,
      clientId,
      clientSecret
    }
  })
}

export const useBasicAuth: <TProps extends Props>() => (
  func: Handler<TProps & { auth: TProps['auth'] & BasicAuth }>
) => Handler<TProps> = () => func => props => withBasicAuth(func, props)
