import { describe, expect, test } from '@jest/globals'
import { useNext, withNext } from '../index'

describe('useNext hook', () => {
  test('returns and executes withNext', async () => {
    let status: any = null
    let headers: any = null
    let json: any = null
    const sut = useNext()
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
        socket: { remoteAddress: '0.0.0.0' },
        httpVersion: '1.1'
      } as any,
      {
        status: (s: number) => (status = s),
        setHeader: (key: string, value: string) =>
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
})

describe('withNext function', () => {
  test('applys result to response', async () => {
    let status: any = null
    let headers: any = null
    let json: any = null
    await withNext(
      async () => ({
        message: 'success'
      }),
      {},
      {
        headers: {},
        originalUrl: '',
        path: '',
        body: {},
        method: 'POST',
        query: {},
        socket: { remoteAddress: '0.0.0.0' },
        httpVersion: '1.1'
      } as any,
      {
        status: (s: number) => (status = s),
        setHeader: (key: string, value: string) =>
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
    await withNext(
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
      {},
      {
        headers: {},
        originalUrl: '',
        path: '',
        body: {},
        method: 'POST',
        query: {},
        socket: { remoteAddress: '0.0.0.0' },
        httpVersion: '1.1'
      } as any,
      {
        status: (s: number) => (status = s),
        setHeader: (key: string, value: string) =>
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
