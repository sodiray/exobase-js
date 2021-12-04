import chai from 'chai'
import * as yup from 'yup'

import * as t from '../types'
import { validate, withShapeValidation } from '../args'

const { assert } = chai

const model = yup.object({
    id: yup.number().required(),
    name: yup.string().required()
})

test('validate throws when missing required attribute', async () => {
    try {
        await validate(model, {
            id: 22,
            // no name
        })
        fail('Expected error to be thrown')
    } catch (err) { }
})

test('validate returns validated model', async () => {
    const result = await validate(model, {
        id: 22,
        name: 'ray'
    })
    assert.equal(result.id, 22)
})

test('validate casts valid model', async () => {
    const result = await validate(model, {
        id: '22',
        name: 'ray'
    })
    assert.equal(result.id, 22)
})

test('withShapeValidation applies model attributes to args', async () => {
    const mockHandlerFn = props => props.args
    const getArgs = props => props.meta.query
    const props = ({
        meta: {
            query: {
                id: 22,
                name: 'mock-nmame'
            }
        }
    } as any) as t.Props
    const args = await withShapeValidation(mockHandlerFn, model, getArgs, props)
    assert.equal(args.id, props.meta.query.id)
    assert.equal(args.name, props.meta.query.name)
})
