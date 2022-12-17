import type { Handler, Props, Request, Response } from '@exobase/core'
import { props, response } from '@exobase/core'
import type { IncomingMessage, ServerResponse } from 'http'
import qs from 'querystring'
import { lowerize, tryit } from 'radash'
import url from 'url'

export type UseNodeOptions = {}
export type NodeFramework = {
  req: IncomingMessage
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage
  }
}

export async function withNode(
  func: Handler<Props & { framework: NodeFramework }>,
  options: UseNodeOptions,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage
  }
) {
  const data = await new Promise<string>(resolve => {
    let d = ''
    req.on('data', (chunk: Buffer) => (d += chunk.toString()))
    req.on('end', () => resolve(d))
  })
  const [error, result] = await tryit(func)({
    ...props(makeRequest(req, data)),
    framework: { req, res }
  })
  setResponse(res, response(error, result))
}

export const useNode: (options?: UseNodeOptions) => (
  func: Handler<Props & { framework: NodeFramework }>
) => (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage
  }
) => Promise<any> = options => func => (req, res) =>
  withNode(func, options ?? {}, req, res)

export function setResponse(
  res: ServerResponse<IncomingMessage> & {
    req: IncomingMessage
  },
  response: Response
) {
  const { body, status = 200, headers = {} } = response as Response
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    ...headers,
    'Content-Length': Buffer.byteLength(payload),
    'Content-Type': 'application/json'
  })
  res.end(payload)
}

const makeRequest = (req: IncomingMessage, data: string): Request => {
  const headers = lowerize(req.headers) as Record<string, string | string[]>
  return {
    headers: headers,
    url: req.url ?? '/',
    body: (() => {
      try {
        return JSON.parse(data)
      } catch {}
      try {
        return qs.parse(data)
      } catch {}
      return data
    })(),
    path: req.url ?? '/',
    method: req.method ?? 'ANY',
    query: url.parse(req.url ?? '', true).query as Record<string, string>,
    ip: req.socket.remoteAddress ?? '',
    startedAt: Date.now(),
    protocol: req.httpVersion.toLowerCase().includes('https')
      ? 'https'
      : 'http',
    httpVersion: req.httpVersion
  }
}
