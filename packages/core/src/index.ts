// IMPORT
import _errors from './errors'
import { initProps, defaultResponse, responseFromError, responseFromResult } from './exo'

// EXPORT
export const errors = _errors
export { initProps, defaultResponse, responseFromError, responseFromResult } from './exo'

export * from './types'

export default {
    errors: _errors,
    defaultResponse,
    initProps,
    responseFromError, 
    responseFromResult
}