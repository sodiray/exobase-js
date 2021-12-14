import _ from 'radash'
import { responseFromResult, responseFromError } from '@exobase/core'
import type { ApiFunction, Props } from '@exobase/core'


const DEFAULT_CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
}

export async function withCors(func: ApiFunction, corsHeaders: Record<string, string>, props: Props) {
  if (props.req.method.toLowerCase() === 'options') {
    return {
      ...props.response,
      headers: {
        ...props.response.headers,
        ...corsHeaders
      }
    }
  }
  const [err, result] = await _.try(func)(props)
  if (err) {
    console.error(err)
  }
  const response = err
    ? responseFromError(err)
    : responseFromResult(result)
  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders
    }
  }
}

export const useCors = (corsHeaders: Record<string, string> = DEFAULT_CORS_HEADERS) => (func: ApiFunction) => _.partial(withCors, func, corsHeaders)
