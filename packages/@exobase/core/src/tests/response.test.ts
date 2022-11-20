import { describe, expect, test } from '@jest/globals'
import {
  defaultResponse,
  responseFromError,
  responseFromResult
} from '../response'
import { AbstractError } from '../types'

describe('responseFromResult function', () => {
  test('returns input when input is already an abstract response', () => {
    const result = responseFromResult(defaultResponse)
    expect(result).toEqual(defaultResponse)
  })
  test('returns wrapped input when input is not an abstract response', () => {
    const result = responseFromResult({
      message: 'success'
    })
    expect(result.body.result).toEqual({ message: 'success' })
  })
})

describe('responseFromError function', () => {
  test('returns input when input is already an abstract response', () => {
    const result = responseFromError(defaultResponse)
    expect(result).toEqual(defaultResponse)
  })
  test('returns wrapped input when input is not an abstract response', () => {
    const error = new Error('BrokenPipe')
    const result = responseFromError(error)
    expect(result.status).toBe(500)
    expect(result.body.error.key).toBe('err.unknown')
  })
  test('returns wrapped error when input is not an abstract response', () => {
    const error = {
      type: '@error:json',
      status: 499,
      key: 'exo.err.test'
    } as AbstractError
    const result = responseFromError(error)
    expect(result.status).toBe(499)
    expect(result.body.error.key).toBe('exo.err.test')
    expect(result.body.error.status).toBe(499)
    expect(result.body.error.type).toBeUndefined()
  })
})
