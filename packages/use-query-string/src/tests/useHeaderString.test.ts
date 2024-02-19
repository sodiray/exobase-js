import type { Request } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import { tryit } from 'radash'
import { useQueryString } from '../index'

describe('useQueryString hook', () => {
  test('parses query and adds to args', async () => {
    const sut = useQueryString(z => ({
      id: z.string(),
      format: z.string()
    }))
    const endpointMock = jest.fn(p => p)
    const props = {
      request: {
        query: {
          id: '23',
          format: 'secret'
        }
      }
    }
    const result = await sut(endpointMock as any)(props as any)
    expect(endpointMock).toBeCalled()
    expect(result.args.id).toBe(props.request.query.id)
    expect(result.args.format).toBe(props.request.query.format)
  })

  test('throws bad request error when validation fails', async () => {
    const endpointMock = jest.fn(p => p)
    const props: any = {
      request: {
        query: {
          id: 'a22'
          // format: 'mock-nmame'
        }
      } as unknown as Request
    }
    const sut = useQueryString(z => ({
      id: z.string(),
      format: z.string()
    }))
    const [err] = await tryit(sut(endpointMock as any))(props)
    expect(err).not.toBeNull()
    expect(err!.message).toContain('Query string validation failed')
  })
})
