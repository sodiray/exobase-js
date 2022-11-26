import { describe, expect, jest, test } from '@jest/globals'
import zod from 'zod'
import { useHeaders } from '../index'
import { withHeaders } from '../useHeaders'

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
})

describe('withHeaders function', () => {
  test('applies model attributes to args', async () => {
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        headers: {
          'x-request-id': 'a22',
          'x-api-key': 'mock-nmame'
        }
      }
    }
    const result = await withHeaders(
      endpointMock,
      zod.object({
        'x-request-id': zod.string(),
        'x-api-key': zod.string()
      }),
      null,
      props as any
    )
    expect(result.args['x-request-id']).toBe(
      props.request.headers['x-request-id']
    )
    expect(result.args['x-api-key']).toBe(props.request.headers['x-api-key'])
  })
})
