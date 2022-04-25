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

export const parse = (key: string): Pick<Permission, 'entity' | 'action' | 'scope'> => {
  const [entity, action, scope] = key.split('::')
  return { entity, action, scope }
}

/**
 * Given a permission key that is required and a permission
 * key that the user posesses return true if the posessed
 * key satisfies the required key.
 * 
 * This funciton specifically deals with scopes by looking
 * at the last element of the key (typically :* or :{id}).
 */
export const ican = (
  required: Pick<Permission, 'entity' | 'action' | 'scope'>, 
  posessed: Pick<Permission, 'entity' | 'action' | 'scope'>
) => {
  if (required.entity !== posessed.entity) return false
  if (required.action !== posessed.action) return false
  if (!required.scope) return true
  if (posessed.scope === '*') return true
  if (required.scope === posessed.scope) return true
  return false
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
  for (const requiredPermission of required) {
    const match = permissions.find(p => ican(requiredPermission, parse(p)))
    if (!match) {
      throw exo.errors.unauthorized({
        details: `Missing required permission(${requiredPermission.key}) to call this function`,
        key: 'exo.err.auth.permission.missing-permission'
      })
    }
  }

  return await func(props)
}

export const usePermissionAuthorization = (options: PermissionAuthorizationOptions) => (func: exo.ApiFunction) => {
  return _.partial(requirePermissions, options, func)
}

