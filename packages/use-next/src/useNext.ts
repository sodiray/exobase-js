import type { Handler, Props, Request, Response } from '@exobase/core'
import { props, response } from '@exobase/core'
import type { NextApiRequest, NextApiResponse } from 'next'
import { tryit } from 'radash'

export type UseNextOptions = {}

export type NextFramework = {
  req: NextApiRequest
  res: NextApiResponse
}

export const useNext: (
  options?: UseNextOptions
) => (
  func: Handler<Props & { framework: NextFramework }>
) => (req: NextApiRequest, res: NextApiResponse) => Promise<any> =
  options => func => async (req, res) => {
    const [error, result] = await tryit(func)({
      ...props(makeReq(req)),
      framework: { req, res }
    })
    const finalResponse = response(error, result)
    setResponse(res, finalResponse)
    return finalResponse
  }

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
  // NOTE: In Next.js they put both query and path
  // params in the same object (query) so we
  // duplicate that object into both attributes.
  query: req.query as Record<string, string>,
  params: req.query as Record<string, string>,
  ip: req.socket.remoteAddress ?? '',
  startedAt: Date.now(),
  protocol: req.httpVersion.toLowerCase().includes('https') ? 'https' : 'http',
  httpVersion: req.httpVersion
})
