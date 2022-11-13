import { defaultResponse } from '@exobase/core'
import { describe, expect, test } from '@jest/globals'
import { DEFAULT_CORS_HEADERS, useCors, withCors } from '../index'

describe('useCors hook', () => {
  test('returns and executes withCors function', async () => {
    const sut = useCors()
    const result = await sut(async () => {
      throw new Error('Expected next func to not be called')
    })({
      request: {
        method: 'OPTIONS'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers']
    )
    expect(result.headers['Access-Control-Allow-Origin']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin']
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods']
    )
  })
})

describe('withCors function', () => {
  test('calls next func when request method is not OPTIONS', async () => {
    const result = await withCors(async () => 'success', undefined, {
      request: {
        method: 'POST'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers']
    )
    expect(result.headers['Access-Control-Allow-Origin']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin']
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods']
    )
  })
  test('returns response without calling function when method is OPTIONS', async () => {
    const result = await withCors(
      async () => {
        throw new Error('Expected next func to not be called')
      },
      undefined,
      {
        request: {
          method: 'OPTIONS'
        },
        response: defaultResponse
      } as any
    )
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers']
    )
    expect(result.headers['Access-Control-Allow-Origin']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin']
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods']
    )
  })
  test('applies custom headers', async () => {
    const result = await withCors(
      async () => {
        throw new Error('Expected next func to not be called')
      },
      {
        'Access-Control-Allow-Headers': 'X-Api-Key'
      },
      {
        request: {
          method: 'OPTIONS'
        },
        response: defaultResponse
      } as any
    )
    expect(result.headers['Access-Control-Allow-Headers']).toBe('X-Api-Key')
    expect(result.headers['Access-Control-Allow-Origin']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin']
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods']
    )
  })
  test('handles error from next func', async () => {
    const result = await withCors(
      async () => {
        throw new Error("Ignore this, it's OK, expected to log when testing")
      },
      undefined,
      {
        request: {
          method: 'POST'
        },
        response: defaultResponse
      } as any
    )
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Headers']
    )
    expect(result.headers['Access-Control-Allow-Origin']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Origin']
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_CORS_HEADERS['Access-Control-Allow-Methods']
    )
  })
})
