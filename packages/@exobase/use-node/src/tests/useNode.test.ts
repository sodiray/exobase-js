import { describe, expect, jest, test } from '@jest/globals'
import { useNode } from '../index'

describe('useNode function', () => {
  test('applys result to response', async () => {
    const endpoint = jest.fn(() => ({ message: 'done' }))
    const writeHead = jest.fn()
    const end = jest.fn()
    const sut = useNode()
    await sut(endpoint as any)(
      {
        headers: {},
        originalUrl: '',
        path: '',
        body: {},
        method: 'POST',
        query: {},
        socket: {
          remoteAddress: '0.0.0.0'
        },
        httpVersion: 'HTTPS/1.1',
        on: (event: 'data' | 'end', cb: Function) => {
          if (event === 'data') {
            return cb('{}')
          }
          if (event === 'end') {
            return cb()
          }
        }
      } as any,
      {
        writeHead,
        end
      } as any
    )
    expect(endpoint).toBeCalled()
    expect(end).toHaveBeenCalledWith(
      JSON.stringify({ result: { message: 'done' }, status: 200, error: null })
    )
  })
})
