export interface AbstractError {
  /**
   * Always @error:json when thrown by a
   * exobase hook
   */
  type: '@error:json'
  status: number
}

export interface ErrorResult {
  error: AbstractError
  result: null
  status: number
}

export interface SuccessResult<T> {
  error: null
  result: T
  status: number
}

export type Result<T> = ErrorResult | SuccessResult<T>

export type Request = {
  headers: Record<string, string | string[]>
  url: string
  path: string
  body: Record<string, any> | string | null
  method: string
  query: Record<string, string>
  ip: string
  /**
   * Milliseconds timestamp when the request started
   */
  startedAt: number
  httpVersion: string
  protocol: string
}

export type Response = {
  type: '@exobase:response'
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
