import type { Request } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import zod from 'zod'
import { useQueryArgs } from '../index'
import { withQueryArgs } from '../useQueryArgs'

describe('useQueryArgs hook', () => {
  test('parses query and adds to args', async () => {
    const sut = useQueryArgs(z => ({
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

describe('withQueryArgs function', () => {
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
    const result = await withQueryArgs(
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
