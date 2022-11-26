import { trim } from 'radash'
import type { HttpMethod, HttpPath } from './types'

export type Trie = TrieNode
export type TrieNode = {
  path: string
  children: TrieNode[]
  handlers: Partial<Record<HttpMethod, Function>>
}

export const empty: Trie = {
  path: '/',
  handlers: {},
  children: []
}

export const addNode = (
  trie: Trie,
  method: HttpMethod,
  path: HttpPath,
  handler: Function
): Trie => {
  const parts = trim(path, '/').split('/')
  let node = trie
  for (const part of parts) {
    const match =
      node.children.find(c => c.path === part) ??
      node.children.find(c => c.path === '*')
    if (match) {
      node = match
    } else {
      const newNode: TrieNode = {
        path: part,
        children: [],
        handlers: {}
      }
      node.children.push(newNode)
      node = newNode
    }
  }
  node.handlers[method] = handler
  return trie
}

export const search = (
  trie: Trie,
  method: HttpMethod,
  path: HttpPath
): Function | null => {
  const parts = trim(path, '/').split('/')
  let node = trie
  for (const part of parts) {
    const match =
      node.children.find(c => c.path === part) ??
      node.children.find(c => c.path === '*')
    if (!match) return null
    node = match
  }
  return node.handlers[method] ?? node.handlers['*'] ?? null
}
