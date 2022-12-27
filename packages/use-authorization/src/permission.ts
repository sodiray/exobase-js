import type { Permission, PermissionKey } from './types'

export const parse = (str: PermissionKey): Permission => {
  const [acl, scope, uri] = str.split('::')
  return {
    acl: acl as Permission['acl'],
    scope,
    uri,
    name: null
  }
}

export const stringify = (p: Permission): PermissionKey => {
  return `${p.acl}::${p.scope}::${p.uri}`
}
