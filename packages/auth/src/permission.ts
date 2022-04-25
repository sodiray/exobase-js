import _ from 'radash'
import * as exo from '@exobase/core'
import { Token } from './token'

export type Permission = {
  entity: string
  action: string
  scope: string
  key: string
  description: string
}

/*
* Permission Key = {entity}::{action}::{scope}
* user::{id}::read
* user::{id}::update
* user::*::update
*/
export const create = (
  entity: string, 
  action: string, 
  scope?: string, 
  description?: string
): Permission => ({
  entity,
  action,
  scope: scope ?? null,
  key: scope ? `${entity}::${action}::${scope}` : `${entity}::${action}`,
  description: description ?? ''
})

export type PermissionAuthorizationOptions = {
  require: Permission[] | ((props: exo.Props) => Promise<Permission[]>)
}

export async function requirePermissions (options: PermissionAuthorizationOptions, func: exo.ApiFunction, props: exo.Props) {
  const token = props.auth?.token as Token
  if (!token) {
    throw exo.errors.unauthorized({
      details: 'Cannot call this function without a valid authentication token',
      key: 'exo.err.auth.permission.on-token'
    })
  }
  const permissions = token.permissions ?? []
  const required = _.isFunction(options.require) 
    ? await (options.require as (props: exo.Props) => Promise<Permission[]>)(props) 
    : options.require as Permission[]
  for (const { key } of required) {
    const match = permissions.find(p => p === key)
    if (!match) {
      throw exo.errors.unauthorized({
        details: `Missing required permission(${key}) to call this function`,
        key: 'exo.err.auth.permission.missing-permission'
      })
    }
  }

  return await func(props)
}

export const usePermissionAuthorization = (options: PermissionAuthorizationOptions) => (func: exo.ApiFunction) => {
  return _.partial(requirePermissions, options, func)
}

