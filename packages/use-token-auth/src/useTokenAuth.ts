import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import * as jwt from 'jsonwebtoken'
import { isFunction, tryit } from 'radash'
import { Token } from './token'

export interface UseTokenAuthOptions {
  type?: 'id' | 'access'
  iss?: string
  aud?: string
}

export type TokenAuth<TExtraData = {}> = {
  token: Token<TExtraData>
}

const forbidden = (extra: { info: string; key: string }) => {
  return error({
    message: 'Not Authorized',
    status: 403,
    ...extra
  })
}

const unauthorized = (extra: { info: string; key: string }) => {
  return error({
    message: 'Not Authenticated',
    status: 401,
    ...extra
  })
}

const validateClaims = (decoded: Token, options: UseTokenAuthOptions) => {
  const { type, iss, aud } = options

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

const verifyToken = async (token: string, secret: string): Promise<Token> => {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) =>
      err ? reject(err) : resolve(decoded as Token)
    )
  })
}

export async function withTokenAuth<TProps extends Props>(
  func: Handler<TProps & { auth: TProps['auth'] & TokenAuth }>,
  secret: string | ((props: Props) => string | Promise<string>),
  options: UseTokenAuthOptions,
  props: TProps
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

  const s = isFunction(secret) ? await Promise.resolve(secret(props)) : secret
  const [err, decoded] = await tryit(verifyToken)(bearerToken, s)

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

export const useTokenAuth: <TProps extends Props>(
  secret: string | ((props: Props) => string | Promise<string>),
  options?: UseTokenAuthOptions
) => (
  func: Handler<TProps & { auth: TProps['auth'] & TokenAuth }>
) => Handler<TProps> =
  (secret, options = {}) =>
  func =>
  props =>
    withTokenAuth(func, secret, options, props)
