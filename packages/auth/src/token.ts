import * as jwt from 'jsonwebtoken'
import { Permission } from './permission'


export type Token <ExtraData = any> = {
  exp: number
  sub: string
  iss: string
  type: 'id' | 'access'
  aud: string
  ttl: number
  permissions: string[]
  scopes: string[]
  entity?: string
  provider?: string
  extra?: ExtraData
}

export const create = <ExtraData = {}> ({
  sub,
  type,
  aud,
  iss,
  secret,
  entity,
  ttl = 1200,
  permissions = [],
  scopes = [],
  extra,
  provider
}: {
  sub: string
  type: 'id' | 'access'
  aud: string
  iss: string
  secret: string
  entity?: string
  /**
   * Number of seconds from now the token should be considered
   * valid. Defaults to 1200 seconds (20 minutes)
   */
  ttl?: number
  permissions?: Permission[]
  scopes?: string[]
  extra?: ExtraData,
  provider?: string
}): string => {

  const payload: Token<ExtraData> = {
    exp: Math.floor(Date.now() + (ttl * 1000)),
    sub,
    iss,
    type,
    aud,
    permissions: permissions.map(p => p.key),
    scopes,
    ttl,
    entity,
    provider,
    extra: extra ?? {} as ExtraData
  }

  return jwt.sign(payload, secret)

}