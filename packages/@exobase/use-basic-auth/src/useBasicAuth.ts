import type { ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'

export type BasicAuth = {
  clientId: string
  clientSecret: string
}

export const unauthenticated = (extra: { info: string; key: string }) => {
  return error({
    message: 'Not Authenticated',
    status: 401,
    ...extra
  })
}

export async function withBasicAuth(func: ApiFunction, props: Props) {
  const header = props.request.headers['authorization'] as string
  if (!header) {
    throw unauthenticated({
      info: 'This function requires authentication via a token',
      key: 'exo.err.basic.noheader'
    })
  }

  const basicToken = header.startsWith('Basic ') && header.replace('Basic ', '')
  if (!basicToken) {
    throw unauthenticated({
      info: 'This function requires authentication via a token',
      key: 'exo.err.basic.nobasic'
    })
  }

  const [clientId, clientSecret] = Buffer.from(basicToken, 'base64')
    .toString()
    .split(':')

  if (!clientId || !clientSecret) {
    throw unauthenticated({
      info: 'Cannot call this function without a valid authentication token',
      key: 'exo.err.basic.misformat'
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

export const useBasicAuth = () => (func: ApiFunction) => (props: Props) =>
  withBasicAuth(func, props)
