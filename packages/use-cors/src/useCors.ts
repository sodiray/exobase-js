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

export const useCors = (config: {
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
   * If true your provided options will be used exclusivly
   * If false (default) your provided options, when possible
   * will be appended to the default list of values
   */
  strict?: boolean
}) =>
  hook(func => async props => {
    const isStrict = config.strict ?? false

    const origins = () => {
      return config.origins === '*' ? '*' : config.origins?.join(', ')
    }

    const headers = () => {
      if (!config.headers) return DEFAULT_HEADERS.join(', ')
      if (config.headers === '*') return '*'
      return isStrict
        ? config.headers
        : unique([...DEFAULT_HEADERS, ...config.headers])
    }

    const methods = () => {
      if (!config.methods) return DEFAULT_METHODS.join(', ')
      if (config.methods === '*') return '*'
      return isStrict
        ? config.methods
        : unique([...DEFAULT_METHODS, ...config.methods])
    }

    const headersToApply = {
      'Access-Control-Allow-Origin': origins(),
      'Access-Control-Allow-Methods': methods(),
      'Access-Control-Allow-Headers': headers()
    }

    if (props.request.method.toLowerCase() === 'options') {
      return {
        ...props.response,
        headers: {
          ...props.response.headers,
          ...headersToApply
        }
      }
    }
    const [err, result] = await tryit(func)(props)
    const r = response(err, result)
    return {
      ...r,
      headers: {
        ...r.headers,
        ...headersToApply
      }
    }
  })
