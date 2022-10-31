import { error as createError, ERROR_NAME } from './error'
import * as t from './types'

export const defaultResponse: t.AbstractResponse = {
  _type: '__response__',
  status: 200,
  headers: {},
  body: {
    message: 'success'
  }
}

const makeErrorBody = (
  error: t.AbstractError
): Omit<t.ErrorResult, 'version'> => ({
  error,
  result: null,
  status: error.status
})

const makeSuccessBody = <T>(
  result: T,
  status = 200
): Omit<t.SuccessResult<T>, 'version'> => ({
  error: null,
  result,
  status
})

/**
 * There is a 1 in 1,000,000,000 chance that someone may
 * return an object with _type equal to '_response'
 * and this will break. Nobody do that...
 */
const isResponse = (obj: any): boolean => {
  return obj?._type === '__response__'
}

export const responseFromResult = (result: any): t.AbstractResponse => {
  if (isResponse(result)) {
    return result as t.AbstractResponse
  }

  // If nothing was returned then return the default
  // success response
  if (!result)
    return {
      ...defaultResponse,
      body: makeSuccessBody(defaultResponse.body)
    }

  // Else, the func returned something that should be
  // returned as the json body response
  return {
    ...defaultResponse,
    body: makeSuccessBody(result)
  }
}

export const responseFromError = (error: any): t.AbstractResponse => {
  if (isResponse(error)) {
    return error as t.AbstractResponse
  }

  // If its our custom error then respond with the
  // data indicated by our error object
  if (error?.name === ERROR_NAME) {
    return {
      ...defaultResponse,
      status: error.status,
      body: makeErrorBody(error as t.AbstractError)
    }
  }

  // Else its some generic error then wrap it in our
  // error object as an unknown error
  return {
    ...defaultResponse,
    status: 500,
    body: makeErrorBody(
      createError({
        key: 'err.unknown',
        message: 'Unknown Error',
        status: 500,
        cause: 'UNKNOWN',
        note: 'This one is on us, we apologize for the issue. The issue has been logged and our development team will be working on fixing it asap.'
      })
    )
  }
}
