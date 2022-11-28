import dur, { Duration } from 'durhuman'
import * as jwt from 'jsonwebtoken'

/**
 * See [RFC 7519](https://www.rfc-editor.org/rfc/rfc7519.html#section-4.1.6) for details on
 * the standard JWT fields and their intent.
 */
export type Token<TExtraData = {}> = {
  /**
   * The seconds timestamp when the token
   * should expire. Auto set, based on the ttl
   * when using the createToken function.
   *
   * @example
   * 1669593586
   */
  exp: number
  /**
   * The subject of the token, _who_ the token
   * represents. Typically, thats the id of the
   * user.
   *
   * @example
   * x.user.c830469e279b4b4ca7138d7bc7254ab8
   */
  sub: string
  /**
   * The entity issuing the token, typically the
   * name of your own system.
   *
   * @example
   * exobase.api
   * exobase.services.auth
   */
  iss: string
  /**
   * The seconds timestamp the token was issued
   * at. Auto set, when using the createToken function.
   *
   * @example
   * 1669593586
   */
  iat: number
  /**
   * The type of token. Do your own research and
   * understand the difference but in short: id
   * tokens are for people/users and access tokens
   * are for systems/services.
   */
  type: 'id' | 'access'
  /**
   * The audience intended to receive the token.
   *
   * @example
   * exobase.app
   * exobase.admin
   * exobase.dashboard
   */
  aud: string
  /**
   * In text (e.g. '2 weeks'), how long the token
   * should live until it expires.
   *
   * @example
   * '2 weeks'
   * '1 month'
   * '12 hours'
   */
  ttl: Duration
  /**
   * A string list of permissions.
   */
  permissions: string[]
  /**
   * A string list of roles.
   */
  roles: string[]
  /**
   * A string list of scopes.
   */
  scopes: string[]
  /**
   * Any additional information you need can be
   * stored here.
   */
  extra: TExtraData
}

export const createToken = <TExtraData = {}>(
  secret: string,
  token: Pick<Token, 'sub' | 'type' | 'aud' | 'iss' | 'ttl'> &
    Pick<
      Partial<Token<TExtraData>>,
      'permissions' | 'roles' | 'scopes' | 'extra'
    >
): string => {
  const now = Math.floor(Date.now() / 1000)
  const payload: Token<TExtraData> = {
    ...token,
    iat: now,
    exp: now + dur(token.ttl, 'seconds'),
    permissions: token.permissions ?? [],
    roles: token.roles ?? [],
    scopes: token.scopes ?? [],
    extra: token.extra ?? ({} as TExtraData)
  }
  return jwt.sign(payload, secret)
}
