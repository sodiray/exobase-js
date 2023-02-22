import { describe, expect, test } from '@jest/globals'
import {
  defaultResponse,
  responseFromError,
  responseFromResult
} from '../response'

describe('responseFromResult function', () => {
  test('returns input when input is already an abstract response', () => {
    const result = responseFromResult(defaultResponse)
    expect(result).toEqual(defaultResponse)
  })
  test('returns wrapped input when input is not an abstract response', () => {
    const result = responseFromResult({
      message: 'success'
    })
    expect(result.body).toEqual({ message: 'success' })
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
    expect(result.body.message).toBe('Unknown Error')
  })
})
