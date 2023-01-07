import { ApiError } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import { tryit } from 'radash'
import { usePathParams } from '../index'

describe('usePathParams hooks', () => {
  test('parses params and applies values to args', async () => {
    const sut = usePathParams(z => ({
      id: z.string().transform(s => parseInt(s)),
      name: z.string()
    }))
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        params: {
          id: '22',
          name: 'mock-name'
        }
      }
    }
    const result = await sut(endpointMock as any)(props as any)
    expect(endpointMock).toBeCalled()
    expect(result.args.id).toBe(22)
    expect(result.args.name).toBe('mock-name')
  })
  test('throws correct error when validation fails', async () => {
    const sut = usePathParams(z => ({
      id: z.string().transform(s => parseInt(s)),
      name: z.string()
    }))
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        params: {
          id: '22'
          // name: 'mock-name'
        }
      }
    }
    const [error] = (await tryit(sut(endpointMock as any))(
      props as any
    )) as unknown as [ApiError]
    expect(error).not.toBeNull()
    expect(error.options.status).toBe(400)
    expect(error.properties.info).toBe('name: required')
  })
})
