import type { Handler, Props, Response } from '@exobase/core'
import { response as toResponse } from '@exobase/core'
import { sort, tryit, unique } from 'radash'
import URL from 'url'

const Tokens = (
  props: Props,
  error: any,
  response: Response
): Record<string, TokenFunction> => {
  const { request } = props
  const end = Date.now()
  const milliseconds = end - request.startedAt
  const seconds = Math.round(milliseconds / 1000)
  return {
    url: () => request.url,
    domain: () => `${URL.parse(request.url).hostname}`,
    path: () => request.path,
    method: () => request.method,
    elapsed: (unit: 's' | 'ms' = 'ms') =>
      unit === 'ms' ? `${milliseconds}ms` : `${seconds}s`,
    date: (format: 'iso' | 'timestamp' = 'timestamp') => {
      const now = new Date()
      if (format === 'iso') return now.toISOString()
      return `${now}`
    },
    status: () => `${response.status}`,
    referrer: () => `${request.headers.referer || request.headers.referrer}`,
    ip: () => request.ip,
    'http-version': () => request.httpVersion,
    protocol: () => request.protocol,
    'user-agent': () => `${request.headers['user-agent'] ?? ''}`
  }
}

export type TokenFunction = (...args: any[]) => string
export type TokenUtil = ReturnType<typeof Tokens>
export type LogFunc<TProps extends Props> = (
  logger: TokenUtil,
  props: TProps,
  error: any,
  response: Response
) => string | object

export type UseLoggingOptions = {
  /**
   * A function to run on the message to prepare
   * it for being logged. Defaults to an empty
   * function (i.e. your message will not be
   * changed)
   *
   * @example
   * ```typescript
   * useLogging(':method :status', {
   *   format: (message) => JSON.stringify({ message })
   * })
   * ```
   */
  format?: (message: string) => string
  /**
   * Any object that can _do logging_. It must contain
   * .log(message) and .error(message) functions.
   */
  logger?: {
    log: (message: string) => void
    error: (message: string) => void
  }
  /**
   * An function that returns a map of token
   * functions that can be referenced by key
   * in the log format string.
   */
  tokens?: (
    tokens: TokenUtil,
    props: Props,
    error: any,
    response: Response
  ) => Record<string, TokenFunction>
}

const defaults: Required<UseLoggingOptions> = {
  format: m => m,
  logger: console,
  tokens: () => ({})
}

type ParsedTemplatePart = {
  token: string
  args: string[]
  raw: string
  calls: boolean
}

export const LogEngine = {
  parse: (template: string): ParsedTemplatePart[] => {
    const tokensRegex = /:([a-z\-]+)/g
    const tokensWithCallRegex = /:([a-z\-]+)\(([a-zA-Z0-\s,]+?)\)/g

    const toList = (iterator: IterableIterator<RegExpMatchArray>) => {
      const list = []
      for (const item of iterator) list.push(item)
      return list
    }

    const matchesWithCall = toList(template.matchAll(tokensWithCallRegex)).map(
      match => {
        const [raw, token, args] = match
        return {
          raw,
          token,
          args: args
            .split(',')
            .map(a => a.trim())
            .filter(x => !!x),
          calls: true
        }
      }
    )

    const templateWithoutCalls = matchesWithCall.reduce((acc, m) => {
      return template.replaceAll(m.raw, '')
    }, template)

    const matchesWithoutCalls = toList(
      templateWithoutCalls.matchAll(tokensRegex)
    ).map(match => {
      const [raw, token] = match
      return { raw, token, args: [], calls: false }
    })

    return unique([...matchesWithoutCalls, ...matchesWithCall], m => m.raw)
  },
  template: (
    template: string,
    parts: ParsedTemplatePart[],
    tokens: Record<string, TokenFunction>
  ): string => {
    return sort(parts, p => (p.calls ? 0 : 1)).reduce((acc, part) => {
      const fn = tokens[part.token]
      if (!fn) {
        throw new Error(
          `[useLogging] Invalid configuration, unknown token: ${part.token}`
        )
      }
      return acc.replaceAll(part.raw, fn(...part.args))
    }, template)
  }
}

export async function withLogging<TProps extends Props>(
  func: Handler<TProps>,
  template: string,
  options: Required<UseLoggingOptions>,
  props: TProps
) {
  const [err, result] = await tryit(func)(props)
  const response = toResponse(err, result)
  const defaultTokens = Tokens(props, err, response)
  const tokens = {
    ...defaultTokens,
    ...options.tokens(defaultTokens, props, err, response)
  }
  const message = LogEngine.template(
    template,
    LogEngine.parse(template),
    tokens
  )
  if (err) options.logger.error(message)
  else options.logger.log(message)
  return response
}

export const useLogging: <TProps extends Props>(
  template?: string,
  options?: UseLoggingOptions
) => (func: Handler<TProps>) => Handler<TProps> =
  (
    template = '[:method] :path at :date(iso) -> :status in :elapsed(ms)',
    options = defaults
  ) =>
  func =>
  props =>
    withLogging(func, template, { ...defaults, ...options }, props)
