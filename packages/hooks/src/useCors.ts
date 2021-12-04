import _ from 'radash'
import { responseFromResult } from '@exobase/core'
import type { ApiFunction, Props } from '@exobase/core'


const DEFAULT_CORS_HEADERS = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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
  const result = await func(props)
  const response = responseFromResult(result)
  return {
    ...response,
    headers: {
      ...response.headers,
      ...corsHeaders
    }
  }
}

export const useCors = (corsHeaders: Record<string, string> = DEFAULT_CORS_HEADERS) => (func: ApiFunction) => _.partial(withCors, func, corsHeaders)
