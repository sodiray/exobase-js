export interface AbstractError {
  /**
   * Always exobase.error when thrown by a
   * exobase hook
   */
  name: string

  /**
   * A short human readable message fit for
   * showing an end user. Generic in spirit
   * regarding the basic idea around the
   * issue that ocurred.
   */
  message: string

  /**
   * The http status code to return.
   */
  status: number

  /**
   * Specific -- generic -- to the exact reason
   * the error ocurred. Formatted {status}{n}.
   * Ex. authentication failed because session is bad => 4011
   * Ex. authentication failed because session is exp => 4012
   * Ex. could not find user in db with provided id => 4043
   * Ex. could not find user in db in ok state => 40422
   * Ex. user does not have permission to read user data => 40310
   */
  cause: string

  /**
   * Hyper specific -- never duplicated -- key that uniquely identifies
   * every error thrown in the code base. Formatted lune.err.{module}.{module}.{phrase}
   *   Ex. auth failed line 304 of get user => lune.err.user.get-user.emorphis
   *   Ex. auth failed line 33 of get user => lune.err.user.get-user.bourish
   *   Ex. user not found line 10 of get user => lune.err.user.get-user.sallest
   *   Ex. room locked line 217 of inviteCode => lune.err.join.invite-code.allour
   * Keep the phrase unique and random.
   * Keep the phrase weird so its easy to ensure uniqueness.
   * Keep the phrase short and easy to share so end users can easily report it.
   * Personally, I like names of star constellations. When you run out of those
   * anything that sounds like a star constelation will work.
   */
  key: string

  /**
   * Specific to the exact cause of this issue. Human readable
   * string as long as need to explain why the problem ocurred
   * and if possible how to correct it. More developer focused
   */
  note: string
}

export interface ErrorResult {
  error: AbstractError
  result: null
  version: string
  status: number
}

export interface SuccessResult<T> {
  error: null
  result: T
  version: string
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
  _type: '__response__'
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
