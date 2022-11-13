import type { Handler, Props, Request, Response } from '@exobase/core'
import { props, responseFromError, responseFromResult } from '@exobase/core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { try as tryit } from 'radash'

export type UseNextOptions = {}

export type NextFramework = {
  req: NextApiRequest
  res: NextApiResponse
}

export async function withNext(
  func: Handler<Props & { framework: NextFramework }>,
  options: UseNextOptions,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const [error, result] = await tryit(func)({
    ...props(makeReq(req)),
    framework: { req, res }
  })
  if (error) {
    console.error(error)
  }
  const response = error ? responseFromError(error) : responseFromResult(result)
  setResponse(res, response)
}

export const useNext: (
  options?: UseNextOptions
) => (
  func: Handler<Props & { framework: NextFramework }>
) => (req: NextApiRequest, res: NextApiResponse) => Promise<any> =
  options => func => (req, res) =>
    withNext(func, options ?? {}, req, res)

export function setResponse(res: NextApiResponse, response: Response) {
  const { body, status = 200, headers = {} } = response as Response
  res.status(status)
  for (const [key, val] of Object.entries(headers)) {
    res.setHeader(key, val)
  }
  res.json(body)
}

const makeReq = (req: NextApiRequest): Request => ({
  headers: req.headers as Record<string, string | string[]>,
  url: req.url ?? '/',
  body: req.body,
  path: req.url ?? '/',
  method: req.method ?? 'ANY',
  query: req.query as Record<string, string>,
  ip: req.socket.remoteAddress ?? '',
  startedAt: Date.now(),
  protocol: req.httpVersion.toLowerCase().includes('https') ? 'https' : 'http',
  httpVersion: req.httpVersion
})
