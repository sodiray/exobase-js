import _ from 'radash'
import * as exo from '@exobase/core'


export async function requireBasicToken (func: exo.ApiFunction, props: exo.Props) {
  const header = props.req.headers['authorization'] as string
  if (!header) {
    throw exo.errors.unauthorized({
      details: 'This function requires authentication via a token', 
      key: 'exo.err.access.token.canes-venatici'
    })
  }
  
  const basicToken = header.startsWith('Basic ') && header.replace('Basic ', '')
  if (!basicToken) {
    throw exo.errors.unauthorized({
      details: 'This function requires authentication via a token', 
      key: 'exo.err.access.token.noramusine'
    })
  }
  
  const [clientId, clientSecret] = Buffer.from(basicToken, 'base64').toString().split(':')
  if (!clientId || !clientSecret) {
    throw exo.errors.unauthorized({
      details: 'Cannot call this function without a valid authentication token', 
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

export type BasicAuth = {
  clientId: string
  clientSecret: string
}

export const useBasicAuthentication = () => (func: exo.ApiFunction) => {
  return _.partial(requireBasicToken, func)
}

