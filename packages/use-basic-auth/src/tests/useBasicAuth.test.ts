import { describe, expect, test } from '@jest/globals'
import { useBasicAuth } from '../index'
import { withBasicAuth } from '../useBasicAuth'

describe('useBasicAuth function', () => {
  test('returns hook function that calls withBasicAuth', async () => {
    const sut = useBasicAuth()
    const token = Buffer.from('client:secret').toString('base64')
    const result = await sut(async () => 'success')({
      request: {
        headers: {
          authorization: `Basic ${token}`
        }
      }
    } as any)
    expect(result).toBe('success')
  })
})

describe('withBasicAuth function', () => {
  test('does not fail with correct client id and secret', async () => {
    const token = Buffer.from('client:secret').toString('base64')
    const result = await withBasicAuth(async () => 'success', {
      request: {
        headers: {
          authorization: `Basic ${token}`
        }
      }
    } as any)
    expect(result).toBe('success')
  })
  test('applies parsed client id and secret', async () => {
    const token = Buffer.from('client:secret').toString('base64')
    const result = await withBasicAuth(async ({ auth }) => auth, {
      request: {
        headers: {
          authorization: `Basic ${token}`
        }
      }
    } as any)
    expect(result.clientId).toBe('client')
    expect(result.clientSecret).toBe('secret')
  })
  test('throws if authorization header is not provided', async () => {
    try {
      await withBasicAuth(async ({ auth }) => auth, {
        request: {
          headers: {}
        }
      } as any)
    } catch (err: any) {
      expect(err.properties.key).toBe('exo.err.basic.noheader')
      return
    }
    throw new Error('Expected withBasicAuth to throw error')
  })
  test('throws if authorization header does not begin with Basic', async () => {
    try {
      await withBasicAuth(async ({ auth }) => auth, {
        request: {
          headers: {
            authorization: 'Invalid value'
          }
        }
      } as any)
    } catch (err: any) {
      expect(err.properties.key).toBe('exo.err.basic.nobasic')
      return
    }
    throw new Error('Expected withBasicAuth to throw error')
  })
  test('throws if authorization header does not contain a client id and secret', async () => {
    const token = Buffer.from('invalid_value').toString('base64')
    try {
      await withBasicAuth(async ({ auth }) => auth, {
        request: {
          headers: {
            authorization: `Basic ${token}`
          }
        }
      } as any)
    } catch (err: any) {
      expect(err.properties.key).toBe('exo.err.basic.misformat')
      return
    }
    throw new Error('Expected withBasicAuth to throw error')
  })
})
