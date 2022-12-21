/**
 * Any object that is thrown, and matches this interface,
 * having a format property equal to '@json' will be
 * treated as a known error by the root hook.
 *
 * If a 'status' property exists it will be used to set
 * the HTTP status on the response.
 */
export interface JsonError {
  /**
   * Always '@json' when thrown by an exobase hook
   */
  format: '@json'
}

export type Request = {
  headers: Record<string, string | string[]>
  url: string
  path: string
  body: Record<string, any> | string | null
  method: string
  query: Record<string, string>
  params: Record<string, string>
  ip: string
  /**
   * Milliseconds timestamp when the request started
   */
  startedAt: number
  httpVersion: string
  protocol: string
}

export type Response = {
  type: '@response'
  headers: Record<string, string | string[]>
  status: number
  body: any
}

export type Props<
  TArgs extends {} = {},
  TServices extends {} = {},
  TAuth extends {} = {},
  TRequest extends Request = Request,
  TFramework extends {} = {}
> = {
  auth: TAuth
  args: TArgs
  services: TServices
  request: TRequest
  response: Response
  framework: TFramework
}

export type Handler<TProps extends Props = Props, TResult = any> = (
  props: TProps
) => Promise<TResult>
