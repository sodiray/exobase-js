type Json = string | number | boolean | { [x: string]: Json } | Array<Json>

export const isError = (err: any): err is ApiError => {
  return err instanceof ApiError
}

export type ErrorProperties = { message: string; status: number } & Record<
  string,
  Json
>

export type ErrorPropertiesWithoutStatus = {
  message?: string
  status?: never
} & Record<string, Json>

/**
 * This error class is designed to be returned to the
 * user. When thrown, eventually a root hook will
 * handle it, convert it to json, and return it in a
 * response.
 */
export class ApiError extends Error {
  status: number
  properties: ErrorProperties
  // readonly _key: string = '@exo.error'
  constructor(
    /**
     * Any json serializable value is allowed in
     * the object, the entire object will be
     * serialized and returned to the user.
     */
    error: ErrorProperties
  ) {
    super(error.message)
    // Set the prototype explicitly so that instanceof
    // will work as expeted. Object.setPrototypeOf needs
    // to be called immediately after the super(...) call
    // https://stackoverflow.com/a/41429145/7547940
    Object.setPrototypeOf(this, ApiError.prototype)
    this.status = error.status ?? 500
    this.properties = error
  }
}

//
// Just the few most commonly used
// errors for convenience.
//

export class BadRequestError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus) {
    super({
      ...error,
      status: 400,
      message: error.message ?? 'Bad Request'
    })
  }
}

export class NotAuthenticatedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus) {
    super({
      ...error,
      status: 401,
      message: error.message ?? 'Not Authenticated'
    })
  }
}

export class NotAuthorizedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus) {
    super({
      ...error,
      status: 403,
      message: error.message ?? 'Not Authorized'
    })
  }
}

export class NotFoundError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus) {
    super({
      ...error,
      status: 404,
      message: error.message ?? 'Not Found'
    })
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus) {
    super({
      ...error,
      status: 405,
      message: error.message ?? 'Method Not Allowed'
    })
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus) {
    super({
      ...error,
      status: 429,
      message: error.message ?? 'Too Many Requests'
    })
  }
}
