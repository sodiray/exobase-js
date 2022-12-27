import { trim } from 'radash'
import { ParamParser } from './param-parser'
import type { HttpMethod, HttpPath } from './types'

export type Trie = TrieNode
export type TrieNode = {
  path: string
  children: TrieNode[]
  handlers: Partial<Record<HttpMethod, Function>>
  parser: null | ParamParser
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
    const isWildcard = part.match(/^{[^\/]+}$/)
    const match =
      node.children.find(c => c.path === part) ??
      node.children.find(c => c.path === '*')
    if (match) {
      node = match
    } else {
      const newNode: TrieNode = {
        path: isWildcard ? '*' : part,
        children: [],
        handlers: {},
        parser: null
      }
      node.children.push(newNode)
      node = newNode
    }
  }
  node.handlers[method] = handler
  node.parser = ParamParser(path)
  return trie
}

export const search = (
  trie: Trie,
  method: HttpMethod,
  path: HttpPath
): {
  handler: Function | null
  parser: ParamParser | null
} => {
  const parts = trim(path, '/').split('/')
  let node = trie
  for (const part of parts) {
    const match =
      node.children.find(c => c.path === part) ??
      node.children.find(c => c.path === '*')
    if (!match) return { handler: null, parser: null }
    node = match
  }
  return {
    handler: node.handlers[method] ?? node.handlers['*'] ?? null,
    parser: node.parser
  }
}
