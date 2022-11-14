import { describe, expect, jest, test } from '@jest/globals'
import zod from 'zod'
import { useJsonArgs } from '../index'
import { withJsonArgs } from '../useJsonArgs'

describe('useJsonArgs hooks', () => {
  test('parses body and applies values to args', async () => {
    const sut = useJsonArgs(yup => ({
      id: yup.number(),
      name: yup.string()
    }))
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        body: {
          id: 22,
          name: 'mock-nmame'
        }
      }
    }
    const result = await sut(endpointMock as any)(props as any)
    expect(endpointMock).toBeCalled()
    expect(result.args.id).toBe(props.request.body.id)
    expect(result.args.name).toBe(props.request.body.name)
  })
})

describe('withJsonArgs function', () => {
  test('applies model attributes to args', async () => {
    const mockEndpoint = jest.fn(p => p)
    const props = {
      request: {
        body: {
          id: 'a22',
          name: 'mock-nmame'
        }
      }
    }
    const result = await withJsonArgs(
      mockEndpoint,
      zod.object({
        id: zod.string(),
        name: zod.string()
      }),
      null,
      props as any
    )
    expect(result.args.id).toBe(props.request.body.id)
    expect(result.args.name).toBe(props.request.body.name)
  })
})
