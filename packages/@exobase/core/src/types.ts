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

export type AbstractRequest = {
  headers: Record<string, string | string[]>
  url: string
  path: string
  body: Record<string, any> | string | null
  method: string
  query: Record<string, string>
  ip: string
}

export type AbstractResponse = {
  _type: '@exobase:response'
  headers: Record<string, string | string[]>
  status: number
  body: any
}

export interface Props<
  ArgType = any,
  ServiceType = any,
  AuthType = any,
  RequestType extends AbstractRequest = AbstractRequest
> {
  auth: AuthType
  args: ArgType
  services: ServiceType
  request: RequestType
  response: AbstractResponse
}

export type ApiFunction<
  ArgType = any,
  ServiceType = any,
  AuthType = any,
  RequestType extends AbstractRequest = AbstractRequest
> = (
  props: Props<ArgType, ServiceType, AuthType, RequestType>
) => Promise<AbstractResponse | any>
