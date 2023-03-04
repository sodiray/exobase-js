import {
  hook,
  NotAuthenticatedError,
  NotAuthorizedError,
  Props,
  Request
} from '@exobase/core'
import jwt from 'jsonwebtoken'
import { isArray, isFunction, tryit } from 'radash'
import { Token } from './token'

export interface UseTokenAuthOptions {
  type?: 'id' | 'access'
  iss?: string
  aud?: string
  getToken?: (req: Request) => string | null
}

export type TokenAuth<TExtraData = {}> = {
  token: Token<TExtraData>
}

const validateClaims = (decoded: Token, options: UseTokenAuthOptions) => {
  const { type, iss, aud } = options

  if (type) {
    if (!decoded.type || decoded.type !== type) {
      throw new NotAuthorizedError('Given token does not have required type', {
        key: 'exo.err.jwt.caprorilous'
      })
    }
  }

  if (iss) {
    if (!decoded.iss || decoded.iss !== iss) {
      throw new NotAuthorizedError(
        'Given token does not have required issuer',
        {
          key: 'exo.err.jwt.caprisaur'
        }
      )
    }
  }

  if (aud) {
    if (!decoded.aud || decoded.aud !== aud) {
      throw new NotAuthorizedError(
        'Given token does not have required audience',
        {
          key: 'exo.err.jwt.halliphace'
        }
      )
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

const getTokenFromHeader = (req: Request) => {
  const header = req.headers['authorization']
  if (isArray(header)) {
    throw new NotAuthenticatedError(
      'Multiple authorization headers are not allowed',
      {
        key: 'exo.err.jwt.multi'
      }
    )
  }
  return header?.replace(/^Bearer\s/, '') ?? null
}

export const useTokenAuth = <TExtraData extends {} = {}>(
  secret: string | ((props: Props) => string | Promise<string>),
  options: UseTokenAuthOptions = {}
) =>
  hook<Props, Props<{}, {}, TokenAuth<TExtraData>>>(func => async props => {
    const bearerToken = options.getToken
      ? options.getToken(props.request)
      : getTokenFromHeader(props.request)
    if (!bearerToken) {
      throw new NotAuthenticatedError(
        'This function requires authentication via a token',
        {
          key: 'exo.err.jwt.canes-venatici'
        }
      )
    }

    const s = isFunction(secret) ? await Promise.resolve(secret(props)) : secret
    const [err, decoded] = await tryit(verifyToken)(bearerToken, s)

    if (err) {
      if (err.name === 'TokenExpiredError') {
        throw new NotAuthorizedError('Provided token is expired', {
          key: 'exo.err.jwt.expired',
          cause: err
        })
      }
      throw new NotAuthorizedError(
        'Cannot call this function without a valid authentication token',
        {
          key: 'exo.err.jwt.canis-major',
          cause: err
        }
      )
    }

    validateClaims(decoded, options)

    return await func({
      ...props,
      auth: {
        ...props.auth,
        token: decoded as Token<TExtraData>
      }
    })
  })
