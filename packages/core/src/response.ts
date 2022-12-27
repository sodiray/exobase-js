import { omit } from 'radash'
import * as t from './types'

/**
 * There is a 1 in 1,000,000,000 chance that someone may
 * return an object with _type equal to '@response'
 * and this will break. Nobody do that...
 */
export const isResponse = (res: any): res is t.Response => {
  return (res as t.Response)?.type === '@response'
}

export const isJsonError = (err: any): err is t.JsonError => {
  return (err as t.JsonError)?.format === '@json'
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
  // Else, the func returned something that should be
  // returned as the json body response
  return {
    ...defaultResponse,
    body: !result ? defaultResponse.body : result
  }
}

export const responseFromError = (error: any): t.Response => {
  if (isResponse(error)) return error
  // Else its some generic error, wrap it in our
  // error object as an unknown error
  return {
    ...defaultResponse,
    status: error.status ?? 500,
    body: isJsonError(error)
      ? omit(error, ['format'])
      : {
          status: 500,
          message: 'Unknown Error'
        }
  }
}

export const response = (error: any, result: any) => {
  return error ? responseFromError(error) : responseFromResult(result)
}
