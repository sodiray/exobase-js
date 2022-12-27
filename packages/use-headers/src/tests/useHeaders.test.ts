import { describe, expect, jest, test } from '@jest/globals'
import { tryit } from 'radash'
import { useHeaders } from '../index'

describe('useHeaders hook', () => {
  test('parses headers and adds to args', async () => {
    const sut = useHeaders(zod => ({
      'x-request-id': zod.string(),
      'x-api-key': zod.string()
    }))
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        headers: {
          'x-request-id': 'abc',
          'x-api-key': 'secret'
        }
      }
    }
    const result = await sut(endpointMock as any)(props as any)
    expect(endpointMock).toBeCalled()
    expect(result.args['x-request-id']).toBe(
      props.request.headers['x-request-id']
    )
    expect(result.args['x-api-key']).toBe(props.request.headers['x-api-key'])
  })
  test('throws bad request when validation fails', async () => {
    const sut = useHeaders(zod => ({
      'x-request-id': zod.string(),
      'x-api-key': zod.string()
    }))
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        headers: {
          'x-request-id': 'abc'
          // 'x-api-key': 'secret'
        }
      }
    }
    const [err] = await tryit(sut(endpointMock as any))(props as any)
    expect(err).not.toBeNull()
    expect(endpointMock).toBeCalledTimes(0)
    expect(err!.message).toBe('Header validation failed')
  })
})
