import { isArray, isString } from 'radash'
import { parse } from './permission'
import type { Trie } from './trie'
import * as trie from './trie'
import type { Permission, PermissionKey } from './types'

const toPermissions = (
  variety: Permission | PermissionKey | (Permission | PermissionKey)[]
): Permission[] => {
  return isArray(variety)
    ? variety.map(p => (isString(p) ? parse(p) : p))
    : isString(variety)
    ? [parse(variety)]
    : [variety]
}

/**
 * Given a permission that is required and set of
 * permissions the user posesses return true if the
 * user's permissions satisfies the required permission.
 */
export const cani = (args: {
  do: Permission | PermissionKey
  with: Trie | Permission | PermissionKey | (Permission | PermissionKey)[]
}): boolean => {
  const needs = isString(args.do) ? parse(args.do) : args.do
  const ptree = trie.isTrie(args.with)
    ? args.with
    : trie.build(toPermissions(args.with))
  const matches = trie.search(ptree, needs)
  if (matches.length === 0) return false
  const related = matches.filter(
    p => p.scope === needs.scope || p.scope === '*'
  )
  if (related.length === 0) return false

  const denied = related.find(r => r.acl === 'deny')
  if (denied) return false

  return true
}

export const user = (
  permissions: Permission | PermissionKey | (Permission | PermissionKey)[]
) => {
  const ptree = trie.build(toPermissions(permissions))
  return {
    do: (required: Permission | PermissionKey) =>
      cani({
        do: required,
        with: ptree
      })
  }
}

export type Cani = ReturnType<typeof user>
export type CaniServices = {
  cani: Cani
}

export default {
  user
}
