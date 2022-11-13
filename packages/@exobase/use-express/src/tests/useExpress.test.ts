import { describe, expect, test } from '@jest/globals'
import { withExpress } from '../index'

describe('withExpress function', () => {
  test('applys result to response', async () => {
    let status: any = null
    let headers: any = null
    let json: any = null
    await withExpress(
      async () => ({
        message: 'success'
      }),
      {
        skipJson: true,
        skipCompression: true
      },
      {
        headers: {},
        originalUrl: '',
        path: '',
        body: {},
        method: 'POST',
        query: {},
        socket: { remoteAddress: '0.0.0.0' }
      } as any,
      {
        status: (s: number) => (status = s),
        set: (key: string, value: string) =>
          (headers = { ...headers, [key]: value }),
        json: (body: any) => (json = body)
      } as any
    )
    expect(status).toBe(200)
    expect(headers).toBeNull()
    expect(json.result).toEqual({ message: 'success' })
    expect(json.error).toBeNull()
    expect(json.status).toBe(200)
  })
  test('applys response object', async () => {
    let status: any = null
    let headers: any = null
    let json: any = null
    await withExpress(
      async ({ response }) => ({
        ...response,
        headers: {
          'request-id': 'abc'
        },
        status: 301,
        body: {
          message: 'content moved'
        }
      }),
      {
        skipJson: true,
        skipCompression: true
      },
      {
        headers: {},
        originalUrl: '',
        path: '',
        body: {},
        method: 'POST',
        query: {},
        socket: { remoteAddress: '0.0.0.0' }
      } as any,
      {
        status: (s: number) => (status = s),
        set: (key: string, value: string) =>
          (headers = { ...headers, [key]: value }),
        json: (body: any) => (json = body)
      } as any
    )
    expect(status).toBe(301)
    expect(headers).toEqual({
      'request-id': 'abc'
    })
    expect(json).toEqual({ message: 'content moved' })
  })
})
