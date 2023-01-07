import type { Handler, Props } from '@exobase/core'
import { NotAuthorizedError } from '@exobase/core'
import { isArray, isFunction, sift } from 'radash'

export type UseRoleAuthorizationOptions<TProps extends Props> = {
  /**
   * A function that returns a list of roles the current
   * user possess.
   */
  roles: (props: TProps) => string[]
  /**
   * The permission(s) that the endpoint requires. If the user
   * does not have permissions (known by the `permissions` property)
   * sufficent enough to cover this requirement an authorization
   * error will be thrown.
   */
  require?:
    | string
    | string[]
    | ((
        props: TProps
      ) => string | string[] | Promise<string> | Promise<string[]>)
}

export async function withRoleAuthorization<TProps extends Props>(
  func: Handler<TProps>,
  options: UseRoleAuthorizationOptions<TProps>,
  props: TProps
) {
  const has = options.roles(props)
  const raw = options.require
    ? await Promise.resolve(
        isFunction(options.require) ? options.require(props) : options.require
      )
    : null
  const requires = sift(isArray(raw) ? raw : [raw])
  for (const required of requires) {
    if (!has.includes(required)) {
      throw new NotAuthorizedError({
        info: `Missing required role (${required}) to call this function`,
        key: 'exo.err.rauthz.failed'
      })
    }
  }
  return await func(props)
}

export const useRoleAuthorization: <TProps extends Props>(
  options: UseRoleAuthorizationOptions<TProps>
) => (func: Handler<TProps>) => Handler<TProps> = options => func => props =>
  withRoleAuthorization(func, options, props)
