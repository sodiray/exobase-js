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

export type InitHook = (
  func: (...args: any[]) => Promise<any>
) => (...args: any[]) => Promise<any>

export type RootHook<
  TInitArgs extends any[],
  TCurrentArgs extends {},
  TCurrentServices extends {},
  TCurrentAuth extends {}
> = (
  func: (
    props: Props<TCurrentArgs, TCurrentServices, TCurrentAuth>
  ) => Promise<any>
) => (...args: TInitArgs) => Promise<any>

export type Hook<
  TNextArgs extends {},
  TNextServices extends {},
  TNextAuth extends {},
  TRequiredServices extends {},
  TRequiredAuth extends {},
  TRequiredArgs extends {}
> = (
  func: (props: Props<TNextArgs, TNextServices, TNextAuth>) => Promise<any>
) => (
  props: Props<TRequiredArgs, TRequiredServices, TRequiredAuth>
) => Promise<any>

export type Handler<TProps extends Props = Props, TResult = any> = (
  props: TProps
) => Promise<TResult>
