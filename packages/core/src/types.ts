
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
  error: null | Error
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

export type NextFunc<TProps extends Props = Props, TResult = any> = (
  props: TProps
) => Promise<TResult>

export type SerializableJson =
  | string
  | number
  | boolean
  | null
  | Date
  | SerializableJson[]
  | { [key: string]: SerializableJson }
