import type {
  AbstractRequest,
  AbstractResponse,
  ApiFunction
} from '@exobase/core'
import { props, responseFromError, responseFromResult } from '@exobase/core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { partial, try as tryit } from 'radash'

export type NextFunctionOptions = {}

export async function withNext(
  func: ApiFunction,
  options: NextFunctionOptions,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [error, result] = await tryit(func)(props(makeReq(req)))
  if (error) {
    console.error(error)
  }
  const response = error ? responseFromError(error) : responseFromResult(result)
  setResponse(res, response)
}

export const useNext =
  (options: NextFunctionOptions = {}) =>
  (func: ApiFunction) =>
    partial(withNext, func, options)

export function setResponse(res: NextApiResponse, response: AbstractResponse) {
  const { body, status = 200, headers = {} } = response as AbstractResponse
  res.status(status)
  for (const [key, val] of Object.entries(headers)) {
    res.setHeader(key, val)
  }
  res.json(body)
}

const makeReq = (req: NextApiRequest): AbstractRequest => ({
  headers: req.headers as Record<string, string | string[]>,
  url: req.url ?? '/',
  body: req.body,
  path: req.url ?? '/',
  method: req.method ?? 'ANY',
  query: req.query as Record<string, string>,
  ip: req.socket.remoteAddress ?? ''
})
