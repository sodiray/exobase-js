import type { ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'
import * as jwt from 'jsonwebtoken'
import { partial } from 'radash'
import { Token } from './token'

export interface JWTAuthOptions {
  type?: 'id' | 'access'
  iss?: string
  aud?: string
  permission?: string
  scope?: string
  secret: string
}

export const forbidden = (extra: { info: string; key: string }) => {
  return error({
    message: 'Not Authorized',
    status: 403,
    ...extra
  })
}

export const unauthorized = (extra: { info: string; key: string }) => {
  return error({
    message: 'Not Authenticated',
    status: 401,
    ...extra
  })
}

const validateClaims = (decoded: Token, options: JWTAuthOptions) => {
  const { type, iss, aud, permission, scope } = options
  if (permission) {
    if (!decoded.permissions || !decoded.permissions.includes(permission)) {
      throw forbidden({
        info: 'Given token does not have required permissions',
        key: 'exo.err.jwt.capricornus'
      })
    }
  }

  if (scope) {
    if (!decoded.scopes || !decoded.scopes.includes(scope)) {
      throw forbidden({
        info: 'Given token does not have required scope',
        key: 'exo.err.jwt.caprinaught'
      })
    }
  }

  if (type) {
    if (!decoded.type || decoded.type !== type) {
      throw forbidden({
        info: 'Given token does not have required type',
        key: 'exo.err.jwt.caprorilous'
      })
    }
  }

  if (iss) {
    if (!decoded.iss || decoded.iss !== iss) {
      throw forbidden({
        info: 'Given token does not have required issuer',
        key: 'exo.err.jwt.caprisaur'
      })
    }
  }

  if (aud) {
    if (!decoded.aud || decoded.aud !== aud) {
      throw forbidden({
        info: 'Given token does not have required audience',
        key: 'exo.err.jwt.halliphace'
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
      info: 'This function requires authentication via a token',
      key: 'exo.err.jwt.canes-venatici'
    })
  }

  if (!header.startsWith('Bearer ')) {
    throw unauthorized({
      info: 'This function requires an authentication via a token',
      key: 'exo.err.jwt.canes-veeticar'
    })
  }

  const bearerToken = header.replace('Bearer ', '')

  const { err, decoded } = await verifyToken(bearerToken, options.secret)

  if (err) {
    console.error('Inavlid token', { err }, 'r.log.jwt.beiyn')
    if (err.name === 'TokenExpiredError') {
      throw forbidden({
        info: 'Provided token is expired',
        key: 'exo.err.jwt.expired'
      })
    }
    throw forbidden({
      info: 'Cannot call this function without a valid authentication token',
      key: 'exo.err.jwt.canis-major'
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
