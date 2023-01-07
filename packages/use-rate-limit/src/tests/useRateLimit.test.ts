import { defaultResponse, Response } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import { useRateLimit } from '../index'

describe('useRateLimit hook', () => {
  test('calls endpoint when rate limit is not exceeded', async () => {
    const endpointMock = jest.fn(() => ({ message: 'success' }))
    const sut = useRateLimit({
      key: 'x',
      limit: {
        window: '10 hours',
        max: 100
      },
      toIdentity: a => a.request.ip
    })
    const mockInc = jest.fn(() => ({
      timestamp: Date.now(),
      count: 1
    }))
    const mockReset = jest.fn()
    const result = (await sut(endpointMock as any)({
      request: {
        ip: 'x.x.x.x'
      },
      services: {
        store: {
          inc: mockInc,
          reset: mockReset
        }
      },
      response: defaultResponse
    } as any)) as Response
    expect(mockInc).toHaveBeenCalledTimes(1)
    expect(mockReset).not.toHaveBeenCalled()
    expect(endpointMock).toHaveBeenCalledTimes(1)
    expect(result.body).toEqual({ message: 'success' })
    expect(result.headers['X-RateLimit-Limit']).toEqual('100')
    expect(result.headers['X-RateLimit-Remaining']).toEqual('99')
  })
})
