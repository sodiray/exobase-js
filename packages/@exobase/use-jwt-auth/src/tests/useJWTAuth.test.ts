import { describe, expect, test } from '@jest/globals'
import { useJWTAuth, withJWTAuth } from '../index'
import * as tu from '../token'

const SECRET = 'unknown'

describe('useJWTAuth hook function', () => {
  test('executes withJWTAuth function', async () => {
    const token = tu.createToken({
      secret: SECRET,
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test'
    })
    const sut = useJWTAuth({
      secret: SECRET
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
})

describe('withJWTAuth function', () => {
  test('returns func result for success', async () => {
    const token = tu.createToken({
      secret: SECRET,
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test'
    })
    const result = await withJWTAuth(
      async () => 'success',
      {
        secret: SECRET
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
  test('returns func result for matching validation', async () => {
    const token = tu.createToken({
      secret: SECRET,
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test'
    })
    const result = await withJWTAuth(
      async () => 'success',
      {
        secret: SECRET,
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
    const token = tu.createToken({
      secret: SECRET,
      ttl: -10000,
      sub: 'test',
      type: 'id',
      aud: 'test',
      iss: 'test'
    })
    try {
      await withJWTAuth(
        async () => 'success',
        {
          secret: SECRET,
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
      expect(err.key).toBe('exo.err.jwt.expired')
      return
    }
    throw new Error(
      'Expected withJWTAuth to throw exception for timeout but it did not'
    )
  })
})
