import { isError } from './error'
import * as t from './types'

/**
 * There is a 1 in 1,000,000,000 chance that someone may
 * return an object with _type equal to '@response'
 * and this will break. Nobody do that...
 */
export const isResponse = (res: any): res is t.Response => {
  return (res as t.Response)?.type === '@response'
}

export const defaultResponse: t.Response = {
  type: '@response',
  status: 200,
  headers: {},
  body: {}
}

export const responseFromResult = (result: any): t.Response => {
  if (isResponse(result)) return result
  // If nothing was returned then return the default
  // success response
  if (!result) return defaultResponse
  // Else, the function returned something that should be
  // returned as the json body response
  return {
    ...defaultResponse,
    body: result
  }
}

export const responseFromError = (error: any): t.Response => {
  if (isResponse(error)) return error
  // If the error is an ApiError then return it's
  // specified properties and status
  if (isError(error))
    return {
      ...defaultResponse,
      status: error.status,
      body: error.properties
    }
  // Else its an error we're not equipped to handle
  // return an unknown to the user.
  return {
    ...defaultResponse,
    status: 500,
    body: {
      status: 500,
      message: 'Unknown Error'
    }
  }
}

export const response = (error: any, result: any) => {
  return error ? responseFromError(error) : responseFromResult(result)
}
