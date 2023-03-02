import { ExobaseError } from '@exobase/core'
import { describe, expect, test } from '@jest/globals'
import { sleep } from 'radash'
import { createToken, useTokenAuth } from '../index'

const SECRET = 'unknown'

describe('useTokenAuth hook function', () => {
  test('executes useTokenAuth function', async () => {
    const token = createToken(SECRET, {
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test',
      ttl: '3 hours'
    })
    const sut = useTokenAuth(SECRET)
    const result = await sut(async () => 'success')({
      request: {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as any
    } as any)
    expect(result).toBe('success')
  })
})

describe('useTokenAuth function', () => {
  test('returns func result for success', async () => {
    const token = createToken(SECRET, {
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test',
      ttl: '3 hours'
    })
    const sut = useTokenAuth(SECRET, {})
    const result = await sut(async () => 'success')({
      request: {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as any
    } as any)
    expect(result).toBe('success')
  })
  test('returns func result for matching validation', async () => {
    const token = createToken(SECRET, {
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test',
      ttl: '3 hours'
    })
    const sut = useTokenAuth(SECRET, {
      type: 'id',
      aud: 'test',
      iss: 'test'
    })
    const result = await sut(async () => 'success')({
      request: {
        headers: {
          authorization: `Bearer ${token}`
        }
      } as any
    } as any)
    expect(result).toBe('success')
  })
  test('throws error when token is expired', async () => {
    const token = createToken(SECRET, {
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test',
      ttl: '0 seconds'
    })
    await sleep(100)
    try {
      const sut = useTokenAuth(SECRET, {
        type: 'id',
        aud: 'test',
        iss: 'test'
      })
      await sut(async () => 'success')({
        request: {
          headers: {
            authorization: `Bearer ${token}`
          }
        } as any
      } as any)
    } catch (err: any) {
      const e = err as ExobaseError
      expect(e.key).toBe('exo.err.jwt.expired')
      return
    }
    throw new Error(
      'Expected useTokenAuth to throw exception for timeout but it did not'
    )
  })
})
