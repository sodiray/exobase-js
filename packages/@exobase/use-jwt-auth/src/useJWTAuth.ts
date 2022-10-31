import * as jwt from 'jsonwebtoken'
import { partial, partob } from 'radash'
import type { ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { Token } from './token'

export interface JWTAuthOptions {
  type?: 'id' | 'access'
  iss?: string
  aud?: string
  permission?: string
  scope?: string
  secret: string
}

export const forbidden = partob(error, {
  message: 'Not Authorized',
  status: 403,
  cause: 'FORBIDDEN'
})

export const unauthorized = partob(error, {
  message: 'Not Authenticated',
  status: 401,
  cause: 'NOT_AUTHENTICATED'
})

const validateClaims = (decoded: Token, options: JWTAuthOptions) => {
  const { type, iss, aud, permission, scope } = options
  if (permission) {
    if (!decoded.permissions || !decoded.permissions.includes(permission)) {
      throw forbidden({
        note: 'Given token does not have required permissions',
        key: 'exo.err.core.auth.capricornus'
      })
    }
  }

  if (scope) {
    if (!decoded.scopes || !decoded.scopes.includes(scope)) {
      throw forbidden({
        note: 'Given token does not have required scope',
        key: 'exo.err.core.auth.caprinaught'
      })
    }
  }

  if (type) {
    if (!decoded.type || decoded.type !== type) {
      throw forbidden({
        note: 'Given token does not have required type',
        key: 'exo.err.core.auth.caprorilous'
      })
    }
  }

  if (iss) {
    if (!decoded.iss || decoded.iss !== iss) {
      throw forbidden({
        note: 'Given token does not have required issuer',
        key: 'exo.err.core.auth.caprisaur'
      })
    }
  }

  if (aud) {
    if (!decoded.aud || decoded.aud !== aud) {
      throw forbidden({
        note: 'Given token does not have required audience',
        key: 'exo.err.core.auth.halliphace'
      })
    }
  }
}

const verifyToken = async (
  token: string,
  secret: string
): Promise<{ err: Error | null; decoded: Token }> => {
  const [err, decoded] = (await new Promise(res => {
    jwt.verify(token, secret, (e, d) => res([e, d as Token]))
  })) as [Error | null, Token]
  return { err, decoded }
}

export async function withJWTAuth(
  func: ApiFunction,
  options: JWTAuthOptions,
  props: Props
) {
  const header = props.request.headers['authorization'] as string
  if (!header) {
    throw unauthorized({
      note: 'This function requires authentication via a token',
      key: 'exo.err.core.auth.canes-venatici'
    })
  }

  if (!header.startsWith('Bearer ')) {
    throw unauthorized({
      note: 'This function requires an authentication via a token',
      key: 'exo.err.core.auth.canes-veeticar'
    })
  }

  const bearerToken = header.replace('Bearer ', '')

  const { err, decoded } = await verifyToken(bearerToken, options.secret)

  if (err) {
    console.error('Inavlid token', { err }, 'r.log.core.auth.beiyn')
    throw forbidden({
      note: 'Cannot call this function without a valid authentication token',
      key: 'exo.err.core.auth.canis-major'
    })
  }

  validateClaims(decoded, options)

  return await func({
    ...props,
    auth: {
      ...props.auth,
      token: decoded
    }
  })
}

export type TokenAuth<ExtraData = any> = {
  token: Token<ExtraData>
}

export const useJWTAuth = (options: JWTAuthOptions) => (func: ApiFunction) => {
  return partial(withJWTAuth, func, options)
}
