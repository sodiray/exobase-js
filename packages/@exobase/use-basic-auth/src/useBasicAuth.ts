import { partial, partob } from 'radash'
import type { ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'

export type BasicAuth = {
  clientId: string
  clientSecret: string
}

export const unauthorized = partob(error, {
  message: 'Not Authenticated',
  status: 401,
  cause: 'NOT_AUTHENTICATED'
})

export async function withBasicAuth(func: ApiFunction, props: Props) {
  const header = props.request.headers['authorization'] as string
  if (!header) {
    throw unauthorized({
      note: 'This function requires authentication via a token',
      key: 'exo.err.access.token.canes-venatici'
    })
  }

  const basicToken = header.startsWith('Basic ') && header.replace('Basic ', '')
  if (!basicToken) {
    throw unauthorized({
      note: 'This function requires authentication via a token',
      key: 'exo.err.access.token.noramusine'
    })
  }

  const [clientId, clientSecret] = Buffer.from(basicToken, 'base64')
    .toString()
    .split(':')

  if (!clientId || !clientSecret) {
    throw unauthorized({
      note: 'Cannot call this function without a valid authentication token',
      key: 'exo.err.access.token.canis-major'
    })
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

export const useBasicAuth = () => (func: ApiFunction) => {
  return partial(withBasicAuth, func)
}
