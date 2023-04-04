import { hook, response } from '@exobase/core'
import { tryit, unique } from 'radash'

const DEFAULT_METHODS = ['GET', 'OPTIONS', 'PATCH', 'DELETE', 'POST', 'PUT']
const DEFAULT_HEADERS = [
  'X-CSRF-Token',
  'X-Requested-With',
  'Authorization',
  'Accept',
  'Accept-Version',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'X-Api-Version'
]

export type UseCorsConfig = {
  /**
   * List of headers the browser should allow in a request
   * made to access the resource you're securing.
   *
   * @deafult X-CSRF-Token, X-Requested-With, Authorization, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version
   */
  headers?: '*' | string[]
  /**
   * List of origins the browser should allow to make a
   * request to access the resource you're securing.
   *
   * @default *
   */
  origins?: '*' | string[]
  /**
   * List of HTTP methods the browser should allow to
   * make a request to the resource you're securing.
   *
   * @default GET, OPTIONS, PATCH, DELETE, POST, PUT
   */
  methods?: '*' | string[]
  /**
   * If true your provided options will be used exclusively
   * If false (default) your provided options, when possible
   * will be appended to the default list of values
   */
  strict?: boolean
}

const origins = (config: UseCorsConfig) => {
  if (!config.origins) return '*'
  if (config.origins === '*') return '*'
  return config.origins.join(', ')
}

const headers = (config: UseCorsConfig) => {
  if (!config.headers) return DEFAULT_HEADERS.join(', ')
  if (config.headers === '*') return '*'
  return config.strict === true
    ? config.headers
    : unique([...DEFAULT_HEADERS, ...config.headers])
}

const methods = (config: UseCorsConfig) => {
  if (!config.methods) return DEFAULT_METHODS.join(', ')
  if (config.methods === '*') return '*'
  return config.strict === true
    ? config.methods
    : unique([...DEFAULT_METHODS, ...config.methods])
}

export const useCors = (config: UseCorsConfig = {}) =>
  hook(func => {
    const corsHeaders = {
      'Access-Control-Allow-Origin': origins(config),
      'Access-Control-Allow-Methods': methods(config),
      'Access-Control-Allow-Headers': headers(config)
    }
    return async props => {
      if (props.request.method.toLowerCase() === 'options') {
        return {
          ...props.response,
          headers: {
            ...props.response.headers,
            ...corsHeaders
          }
        }
      }
      const [err, result] = await tryit(func)(props)
      const r = response(err, result)
      return {
        ...r,
        headers: {
          ...r.headers,
          ...corsHeaders
        }
      }
    }
  })
