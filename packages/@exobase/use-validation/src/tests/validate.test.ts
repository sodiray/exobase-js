import type { Props, Request } from '@exobase/core'
import { describe, expect, jest, test } from '@jest/globals'
import * as yup from 'yup'
import { useJsonArgs } from '../index'
import { validate, withShapeValidation } from '../useValidation'

const model = yup.object({
  id: yup.number().required(),
  name: yup.string().required()
})

describe('validation hooks', () => {
  test('useJsonArgs hook', async () => {
    const sut = useJsonArgs(yup => ({
      id: yup.number().required(),
      name: yup.string().required()
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

describe('validate function', () => {
  test('validate throws when missing required attribute', async () => {
    try {
      await validate(model, {
        id: 22
        // no name
      })
      throw new Error('Expected validate to throw an error')
    } catch (err) {}
  })

  test('validate returns validated model', async () => {
    const result = await validate(model, {
      id: 22,
      name: 'ray'
    })
    expect(result.id).toBe(22)
  })

  test('validate casts valid model', async () => {
    const result = await validate(model, {
      id: '22',
      name: 'ray'
    })
    expect(result.id).toBe(22)
  })
})

describe('withShapeValidation function', () => {
  test('applies model attributes to args', async () => {
    const mockHandlerFn = async (props: Props) => props.args
    const getArgs = (props: Props) => props.request.query
    const props: Pick<Props, 'request'> = {
      request: {
        query: {
          id: 22,
          name: 'mock-nmame'
        }
      } as unknown as Request
    }
    const args = await withShapeValidation(
      mockHandlerFn,
      model,
      getArgs,
      props as Props
    )
    expect(args.id).toBe(props.request.query.id)
    expect(args.name).toBe(props.request.query.name)
  })
})
