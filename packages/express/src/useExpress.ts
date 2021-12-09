import _ from 'radash'
import { json as makeJsonMiddleware } from 'express'
import type {
  Request,
  Response,
  NextFunction
} from 'express'
import type {
  ApiFunction,
  Props,
  Request as ExoRequest,
  Response as ExoResponse
} from '@exobase/core'
import { defaultResponse, responseFromError, responseFromResult } from '@exobase/core'
import * as makeCompressionMiddleware from 'compression'


type ExpressMiddlewareFunc = (req: Request, res: Response, next: NextFunction) => void
type InvertedMiddlewareFunc = (req: Request, res: Response) => Promise<Request>

export type ExpressFunctionOptions = {
  skipJson?: boolean
  skipCompression?: boolean
}

const applyJson = invertMiddleware(makeJsonMiddleware())
const applyCompression = invertMiddleware(makeCompressionMiddleware())

const makeMiddleware = (options: ExpressFunctionOptions) => {
  if (!options.skipCompression && !options.skipJson) return [applyJson, applyCompression]
  if (!options.skipJson) return [applyJson]
  if (!options.skipCompression) return [applyCompression]
}

async function createExpressHandler(
  func: ApiFunction,
  options: ExpressFunctionOptions,
  req: Request,
  res: Response
) {

  const middleware = composeMiddleware(...makeMiddleware(options))
  const reqAfterMiddlware = await middleware(req, res)

  const props: Props = {
    auth: {},
    args: {},
    services: {},
    response: defaultResponse,
    req: makeMeta(reqAfterMiddlware)
  }

  const [error, result] = await _.tryit<any>(func)(props)

  if (error) {
    console.error(error)
  }

  const response = error
    ? responseFromError(error)
    : responseFromResult(result)

  setResponse(res, response)
}

export const useExpress = (options: ExpressFunctionOptions = {}) => (func: ApiFunction) => _.partial(createExpressHandler, func, options)

export function setResponse(
  res: Response,
  response: ExoResponse
) {
  const {
    json,
    status = 200,
    headers = {},
  } = response as ExoResponse
  res.status(status)
  for (const [key, val] of Object.entries(headers)) {
    res.set(key, val)
  }
  res.json(json)
}

const makeMeta = (req: Request): ExoRequest => ({
  headers: req.headers as Record<string, string | string[]>,
  url: req.originalUrl,
  body: req.body,
  cookies: req.cookies,
  method: req.method,
  query: req.query as Record<string, string>
})

/**
 * Middleware functions. Special helpers needed to get
 * express middleware functions inline to play in the
 * fait way. Express middleware functions run async
 * and when they are done they return nothing, they
 * just modify the request. These help us process that
 * and then combine them.
 */
function invertMiddleware(middleware: ExpressMiddlewareFunc): InvertedMiddlewareFunc {
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

function composeMiddleware(...funcs: InvertedMiddlewareFunc[]): InvertedMiddlewareFunc {
  return async (req: Request, res: Response) => {
    let r = req
    for (const func of funcs) {
      r = await func(r, res)
    }
    return r
  }
}