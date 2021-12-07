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
  tokenSignatureSecret,
  entity,
  ttl = 60,
  permissions = [],
  scopes = [],
  extra,
  provider
}: {
  sub: string
  type: 'id' | 'access'
  aud: string
  iss: string
  tokenSignatureSecret: string
  entity?: string
  ttl?: number
  permissions?: Permission[]
  scopes?: string[]
  extra?: ExtraData,
  provider?: string
}): string => {

  const payload: Token<ExtraData> = {
    // (now in milliseconds / 1000) = seconds then + 60 seconds 
    // 60 times ==> 60 minutes from now
    exp: Math.floor((Date.now() / 1000) + (60 * ttl)),
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

  return jwt.sign(payload, tokenSignatureSecret)

}