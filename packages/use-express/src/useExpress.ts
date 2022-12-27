import type { Handler, Props, Request, Response } from '@exobase/core'
import { props, response } from '@exobase/core'
import makeCompressionMiddleware from 'compression'
import type {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express'
import { json as makeJsonMiddleware } from 'express'
import { sift, try as tryit } from 'radash'

type ExpressMiddlewareFunc = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => void

type InvertedMiddlewareFunc = (
  req: ExpressRequest,
  res: ExpressResponse
) => Promise<ExpressRequest>

export type ExpressFramework = {
  req: ExpressRequest
  res: ExpressResponse
}

export type UseExpressOptions = {
  skipJson?: boolean
  skipCompression?: boolean
}

const applyJson = invertMiddleware(makeJsonMiddleware())
const applyCompression = invertMiddleware(
  (makeCompressionMiddleware as unknown as Function)()
)

const makeMiddleware = (options: UseExpressOptions) => {
  return sift([
    !options.skipJson && applyJson,
    !options.skipCompression && applyCompression
  ]) as InvertedMiddlewareFunc[]
}

export async function withExpress(
  func: Handler<Props & { framework: ExpressFramework }>,
  options: UseExpressOptions,
  req: ExpressRequest,
  res: ExpressResponse
) {
  const middleware = composeMiddleware(...makeMiddleware(options))
  const requestAfterMiddlware = await middleware(req, res)
  const [error, result] = await tryit(func)({
    ...props(makeRequest(requestAfterMiddlware)),
    framework: {
      req,
      res
    }
  })
  setResponse(res, response(error, result))
}

export const useExpress: (
  options?: UseExpressOptions
) => (
  func: Handler<Props & { framework: ExpressFramework }>
) => (req: ExpressRequest, res: ExpressResponse) => Promise<any> =
  options => func => (req, res) =>
    withExpress(func, options ?? {}, req, res)

export function setResponse(res: ExpressResponse, response: Response) {
  const { body, status = 200, headers = {} } = response as Response
  res.status(status)
  for (const [key, val] of Object.entries(headers)) {
    res.set(key, val)
  }
  res.json(body)
}

const makeRequest = (req: ExpressRequest): Request => ({
  headers: req.headers as Record<string, string | string[]>,
  url: req.originalUrl,
  path: req.path,
  body: req.body,
  method: req.method,
  query: req.query as Record<string, string>,
  ip: `${req.socket?.remoteAddress}`,
  startedAt: Date.now(),
  protocol: req.protocol,
  httpVersion: req.httpVersion,
  params: {}
})

/**
 * Middleware functions. Special helpers needed to get
 * express middleware functions inline to play in the
 * fait way. Express middleware functions run async
 * and when they are done they return nothing, they
 * just modify the request. These help us process that
 * and then combine them.
 */
function invertMiddleware(
  middleware: ExpressMiddlewareFunc
): InvertedMiddlewareFunc {
  return async (req, res) => {
    return await new Promise((resolve, reject) => {
      const next = (err?: Error) => {
        if (err) reject(err)
        else resolve(req)
      }
      middleware(req, res, next as NextFunction)
    })
  }
}

function composeMiddleware(
  ...funcs: InvertedMiddlewareFunc[]
): InvertedMiddlewareFunc {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    let r = req
    for (const func of funcs) {
      r = await func(r, res)
    }
    return r
  }
}
