import { defaultResponse } from '@exobase/core'
import { describe, expect, test } from '@jest/globals'
import { useCors } from '../index'
import { DEFAULT_HEADERS, DEFAULT_METHODS } from '../useCors'

describe('useCors hook', () => {
  test('returns and executes withCors function', async () => {
    const sut = useCors()
    const result: any = await sut(async () => {
      throw new Error('Expected next func to not be called')
    })({
      request: {
        method: 'OPTIONS'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_HEADERS.join(', ')
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_METHODS.join(', ')
    )
  })
})

describe('withCors function', () => {
  test('calls next func when request method is not OPTIONS', async () => {
    const result: any = await useCors()(async () => 'success')({
      request: {
        method: 'POST'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_HEADERS.join(', ')
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_METHODS.join(', ')
    )
  })
  test('returns response without calling function when method is OPTIONS', async () => {
    const result: any = await useCors()(async () => 'success')({
      request: {
        method: 'OPTIONS'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toBe(
      DEFAULT_HEADERS.join(', ')
    )
    expect(result.headers['Access-Control-Allow-Methods']).toBe(
      DEFAULT_METHODS.join(', ')
    )
  })
  test('applies custom headers', async () => {
    const result: any = await useCors({
      headers: ['X-Api-Key']
    })(async () => 'success')({
      request: {
        method: 'OPTIONS'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toContain(
      'X-Api-Key'
    )
  })
  test('handles error from next func', async () => {
    const result: any = await useCors({
      headers: ['X-Api-Key']
    })(async () => {
      throw new Error('Expected error during testing')
    })({
      request: {
        method: 'POST'
      },
      response: defaultResponse
    } as any)
    expect(result.headers['Access-Control-Allow-Headers']).toContain(
      'X-Api-Key'
    )
  })
})
