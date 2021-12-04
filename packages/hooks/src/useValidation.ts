import * as yup from 'yup'
import _ from 'radash'
import * as exo from '@exobase/core'


export const validate = async (model: any, args: any) => await model.validate(args, {
    stripUnknown: true,
    strict: false,
    abortEarly: true
})

export const withShapeValidation = async (func: exo.ApiFunction, model: any, getArgs: (props: exo.Props) => Record<string, any>, props: exo.Props) => {
    let validArgs = {}
    try {
        validArgs = await validate(model, getArgs(props))
    } catch (err) {
        throw exo.errors.jsonValidationFailed({
            details: err.message,
            key: 'lune.api.err.core.args.baradoor'
        })
    }
    return await func({
        ...props,
        args: {
            ...props.args,
            ...validArgs
        }
    })
}

type Yup = typeof yup
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const useValidation = <TArgs = any>(getData: (props: exo.Props) => any, shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>) => (func: exo.ApiFunction) => {
    const model = yup.object(shapeMaker(yup))
    return _.partial(withShapeValidation, func, model, getData)
}

export const useJsonArgs = _.partial(useValidation, (props: exo.Props) => props.req.body) as <TArgs = any>(getData: (props: exo.Props) => any, shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>) => (func: exo.ApiFunction) => exo.ApiFunction
export const useQueryArgs = _.partial(useValidation, (props: exo.Props) => props.req.query) as <TArgs = any>(getData: (props: exo.Props) => any, shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>) => (func: exo.ApiFunction) => exo.ApiFunction
export const useHeaderArgs = _.partial(useValidation, (props: exo.Props) => props.req.headers) as <TArgs = any>(getData: (props: exo.Props) => any, shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>) => (func: exo.ApiFunction) => exo.ApiFunction