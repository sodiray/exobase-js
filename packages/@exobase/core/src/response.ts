import { omit } from 'radash'
import * as t from './types'

/**
 * There is a 1 in 1,000,000,000 chance that someone may
 * return an object with _type equal to '@exobase:response'
 * and this will break. Nobody do that...
 */
export const isResponse = (res: any): res is t.Response => {
  return (res as t.Response)?.type === '@exobase:response'
}

export const isAbstractError = (err: any): err is t.AbstractError => {
  return (err as t.AbstractError)?.type === '@error:json'
}

export const defaultResponse: t.Response = {
  type: '@exobase:response',
  status: 200,
  headers: {},
  body: {
    message: 'success'
  }
}

export const responseFromResult = (result: any): t.Response => {
  if (isResponse(result)) return result
  // If nothing was returned then return the default
  // success response
  // Else, the func returned something that should be
  // returned as the json body response
  return {
    ...defaultResponse,
    body: {
      result: !result ? defaultResponse.body : result,
      status: defaultResponse.status,
      error: null
    }
  }
}

export const responseFromError = (error: any): t.Response => {
  if (isResponse(error)) return error
  // Else its some generic error, wrap it in our
  // error object as an unknown error
  return {
    ...defaultResponse,
    status: error.status ?? 500,
    body: {
      result: null,
      status: error.status ?? 500,
      error: isAbstractError(error)
        ? omit(error, ['type'])
        : {
            key: 'err.unknown',
            status: 500,
            message: 'Unknown Error',
            info: 'The issue has been logged and our development team will be working on a fix asap.'
          }
    }
  }
}
