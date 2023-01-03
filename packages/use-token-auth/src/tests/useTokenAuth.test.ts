import { describe, expect, test } from '@jest/globals'
import { sleep } from 'radash'
import { createToken, useTokenAuth } from '../index'
import { withTokenAuth } from '../useTokenAuth'

const SECRET = 'unknown'

describe('useTokenAuth hook function', () => {
  test('executes withTokenAuth function', async () => {
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

describe('withTokenAuth function', () => {
  test('returns func result for success', async () => {
    const token = createToken(SECRET, {
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test',
      ttl: '3 hours'
    })
    const result = await withTokenAuth(async () => 'success', SECRET, {}, {
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
    const result = await withTokenAuth(
      async () => 'success',
      SECRET,
      {
        type: 'id',
        aud: 'test',
        iss: 'test'
      },
      {
        request: {
          headers: {
            authorization: `Bearer ${token}`
          }
        } as any
      } as any
    )
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
      await withTokenAuth(
        async () => 'success',
        SECRET,
        {
          type: 'id',
          aud: 'test',
          iss: 'test'
        },
        {
          request: {
            headers: {
              authorization: `Bearer ${token}`
            }
          } as any
        } as any
      )
    } catch (err: any) {
      expect(err.properties.key).toBe('exo.err.jwt.expired')
      return
    }
    throw new Error(
      'Expected withTokenAuth to throw exception for timeout but it did not'
    )
  })
})
