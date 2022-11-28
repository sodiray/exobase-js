import { defaultResponse } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import { useCachedResponse } from '../index'

describe('useCachedResponse hook', () => {
  test('calls endpoint when cache does not have the value', async () => {
    const getMock = jest.fn(() => null)
    const setMock = jest.fn()
    const endpointMock = jest.fn(() => ({ message: 'success' }))
    const sut = useCachedResponse({
      key: '',
      ttl: '10 seconds',
      toIdentity: (a: any) => a
    })
    const result = await sut(endpointMock as any)({
      args: {
        id: 'x.test.abc'
      },
      services: {
        cache: {
          get: getMock,
          set: setMock
        }
      },
      response: defaultResponse
    } as any)
    expect(getMock).toHaveBeenCalledTimes(1)
    expect(setMock).toHaveBeenCalledTimes(1)
    expect(endpointMock).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ message: 'success' })
  })
  test('does not call endpoint when cache has the value', async () => {
    const getMock = jest.fn(() => JSON.stringify({ message: 'success' }))
    const setMock = jest.fn()
    const endpointMock = jest.fn()
    const sut = useCachedResponse({
      key: '',
      ttl: '10 seconds',
      toIdentity: (a: any) => a
    })
    const result = await sut(endpointMock as any)({
      args: {
        id: 'x.test.abc',
        child: {
          name: null,
          value: undefined,
          children: [
            {
              id: '32'
            }
          ]
        }
      },
      services: {
        cache: {
          get: getMock,
          set: setMock
        }
      },
      response: defaultResponse
    } as any)
    expect(getMock).toHaveBeenCalledTimes(1)
    expect(setMock).not.toHaveBeenCalled()
    expect(endpointMock).not.toHaveBeenCalled()
    expect(result).toEqual({ message: 'success' })
  })
  test('skips cache when skipping is configured and request matches', async () => {
    const getMock = jest.fn(() => JSON.stringify({ message: 'success' }))
    const setMock = jest.fn()
    const endpointMock = jest.fn(() => ({ message: 'success' }))
    const sut = useCachedResponse({
      key: '',
      ttl: '10 seconds',
      skipping: {
        header: 'x-skip-cache',
        value: 'yes'
      },
      toIdentity: (a: any) => a
    })
    const result = await sut(endpointMock as any)({
      args: {
        id: 'x.test.abc'
      },
      request: {
        headers: {
          'x-skip-cache': 'yes'
        }
      },
      services: {
        cache: {
          get: getMock,
          set: setMock
        }
      },
      response: defaultResponse
    } as any)
    expect(getMock).not.toHaveBeenCalled()
    expect(setMock).not.toHaveBeenCalled()
    expect(endpointMock).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ message: 'success' })
  })
  test('handles cache functions that throw errors', async () => {
    const getMock = jest.fn(() => {
      throw 'get failed '
    })
    const setMock = jest.fn(() => {
      throw 'set failed '
    })
    const endpointMock = jest.fn(() => ({ message: 'success' }))
    const sut = useCachedResponse({
      key: '',
      ttl: '10 seconds'
    })
    const result = await sut(endpointMock as any)({
      services: {
        cache: {
          get: getMock,
          set: setMock
        }
      },
      response: defaultResponse
    } as any)
    expect(getMock).toHaveBeenCalled()
    expect(setMock).toHaveBeenCalled()
    expect(endpointMock).toHaveBeenCalledTimes(1)
  })
})
