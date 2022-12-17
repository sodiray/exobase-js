import { describe, expect, test } from '@jest/globals'
import { mockRequest, mockResponse } from 'mock-req-res'
import { useExpress } from '../index'

describe('useExpress hook', () => {
  test('applys result to response', async () => {
    let status: any = null
    let headers: any = null
    let json: any = null
    const sut = useExpress({
      skipJson: true,
      skipCompression: true
    })
    await sut(async () => ({
      message: 'success'
    }))(
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
    expect(json).toEqual({
      message: 'success'
    })
  })
  test('applys response object', async () => {
    let status: any = null
    let headers: any = null
    let json: any = null
    const sut = useExpress({
      skipJson: true,
      skipCompression: true
    })
    await sut(async ({ response }) => ({
      ...response,
      headers: {
        'request-id': 'abc'
      },
      status: 301,
      body: {
        message: 'content moved'
      }
    }))(
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
  test('does not fail when using middleware', async () => {
    const sut = useExpress()
    await sut(async () => ({
      message: 'success'
    }))(mockRequest(), mockResponse())
  })
})
