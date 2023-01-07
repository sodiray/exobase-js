import { Response } from './types'

type Json = string | number | boolean | { [x: string]: Json } | Array<Json>

export const isError = (err: any): err is ApiError => {
  return err instanceof ApiError
}

export type ErrorProperties = { message: string } & Record<string, Json>

export type ErrorPropertiesWithoutStatus = {
  message?: string
  status?: never
} & Record<string, Json>

type ResponseOptions = Pick<Response, 'headers' | 'status'>

/**
 * This error class is designed to be returned to the
 * user. When thrown, eventually a root hook will
 * handle it, convert it to json, and return it in a
 * response.
 */
export class ApiError extends Error {
  properties: ErrorProperties
  options: ResponseOptions
  constructor(
    /**
     * Any json serializable value is allowed in
     * the object, the entire object will be
     * serialized and returned to the user.
     */
    error: ErrorProperties,
    options: Partial<ResponseOptions> = {}
  ) {
    super(error.message)
    // Set the prototype explicitly so that instanceof
    // will work as expeted. Object.setPrototypeOf needs
    // to be called immediately after the super(...) call
    // https://stackoverflow.com/a/41429145/7547940
    Object.setPrototypeOf(this, ApiError.prototype)
    this.properties = error
    this.options = {
      status: 500,
      headers: {},
      ...options
    }
  }
}

//
// Just the few most commonly used
// errors for convenience.
//

export class BadRequestError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 400,
        message: error.message ?? 'Bad Request'
      },
      {
        status: 400
      }
    )
  }
}

export class NotAuthenticatedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 401,
        message: error.message ?? 'Not Authenticated'
      },
      {
        status: 401
      }
    )
  }
}

export class NotAuthorizedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 403,
        message: error.message ?? 'Not Authorized'
      },
      {
        status: 403
      }
    )
  }
}

export class NotFoundError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 404,
        message: error.message ?? 'Not Found'
      },
      {
        status: 404
      }
    )
  }
}

export class MethodNotAllowedError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 405,
        message: error.message ?? 'Method Not Allowed'
      },
      {
        status: 405
      }
    )
  }
}

export class TooManyRequestsError extends ApiError {
  constructor(error: ErrorPropertiesWithoutStatus = {}) {
    super(
      {
        ...error,
        status: 429,
        message: error.message ?? 'Too Many Requests'
      },
      {
        status: 429
      }
    )
  }
}
