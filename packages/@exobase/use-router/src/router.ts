import type { Handler } from '@exobase/core'
import { isString } from 'radash'
import type { Trie } from './trie'
import { addNode, empty, search } from './trie'
import type { HttpMethod, HttpPath } from './types'

export type Router = {
  on: (
    method: HttpMethod | HttpMethod[],
    path: HttpPath,
    handler: Handler
  ) => Router
  get: (path: HttpPath, handler: Handler) => Router
  put: (path: HttpPath, handler: Handler) => Router
  post: (path: HttpPath, handler: Handler) => Router
  patch: (path: HttpPath, handler: Handler) => Router
  delete: (path: HttpPath, handler: Handler) => Router
  options: (path: HttpPath, handler: Handler) => Router
  head: (path: HttpPath, handler: Handler) => Router
  lookup: (req: { method: HttpMethod; path: HttpPath }) => Handler | null
}

export const createRouter = (current: Trie = empty): Router => {
  const on = (
    method: HttpMethod | HttpMethod[],
    path: HttpPath,
    handler: Handler
  ) => {
    const methods = isString(method) ? [method] : method
    const newTrie = methods.reduce(
      (acc, m) => addNode(acc, m, path, handler),
      current
    )
    return createRouter(newTrie)
  }
  return {
    on,
    get: (path, handler) => on('GET', path, handler),
    put: (path, handler) => on('PUT', path, handler),
    post: (path, handler) => on('POST', path, handler),
    patch: (path, handler) => on('PATCH', path, handler),
    delete: (path, handler) => on('DELETE', path, handler),
    options: (path, handler) => on('OPTIONS', path, handler),
    head: (path, handler) => on('HEAD', path, handler),
    lookup: req => {
      return search(current, req.method, req.path) as Handler | null
    }
  }
}
