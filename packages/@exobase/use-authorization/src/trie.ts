import { isArray, isObject, sift, trim } from 'radash'
import type { Permission } from './types'

export type Trie = TrieNode
export type TrieNode = {
  children: Record<string, TrieNode>
  value: Permission[]
}

/**
 * Doing _duck typing_ here, if it fits quacks like
 * a trie and it sounds like a trie then we'll
 * assume it's a trie.
 */
export const isTrie = (value: any): value is Trie => {
  if (!value) return value
  const maybeTrie = value as unknown as Trie
  return isArray(maybeTrie.value) && isObject(maybeTrie.children)
}

export const build = (permissions: Permission[]): Trie => {
  const empty: Trie = {
    children: {},
    value: []
  }
  return permissions.reduce((acc, p) => {
    return addNode(acc, p)
  }, empty)
}

// deny::company/*/training/tid/event/eid::edit
// allow::company/cid/training/tid/event/eid::edit
export const addNode = (trie: Trie, permission: Permission): Trie => {
  const parts = trim(permission.uri, '/').split('/')
  let node = trie
  for (const part of parts) {
    const match = node.children[part]
    if (match) {
      node = match
    } else {
      const newNode: TrieNode = {
        children: {},
        value: []
      }
      node.children[part] = newNode
      node = newNode
    }
  }
  node.value.push(permission)
  return trie
}

export const search = (trie: Trie, permission: Permission): Permission[] => {
  const _search = (node: TrieNode, parts: string[]): Permission[] => {
    if (parts.length === 0) return []
    const [thisPart, ...remainingParts] = parts
    const matches = sift(
      thisPart === '*'
        ? [node.children['*']]
        : [node.children[thisPart], node.children['*']]
    )
    if (parts.length === 1) return matches.flatMap(m => m.value)
    return matches.flatMap(m => _search(m, remainingParts))
  }
  return _search(trie, trim(permission.uri, '/').split('/'))
}
