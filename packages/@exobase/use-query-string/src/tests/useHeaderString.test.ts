import type { Request } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import zod from 'zod'
import { useQueryString } from '../index'
import { withQueryString } from '../useQueryString'

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
})

describe('withQueryString function', () => {
  test('applies model attributes to args', async () => {
    const endpointMock = jest.fn(p => p)
    const props: any = {
      request: {
        query: {
          id: 'a22',
          format: 'mock-nmame'
        }
      } as unknown as Request
    }
    const result = await withQueryString(
      endpointMock,
      zod.object({
        id: zod.string(),
        format: zod.string()
      }),
      null,
      props
    )
    expect(result.args.id).toBe(props.request.query.id)
    expect(result.args.name).toBe(props.request.query.name)
  })
})
