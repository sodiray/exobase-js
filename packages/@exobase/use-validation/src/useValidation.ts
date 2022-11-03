import type { ApiFunction, Props } from '@exobase/core'
import { error } from '@exobase/core'
import * as yup from 'yup'
import { KeyOfType, Yup } from './types'

const validationFailed = (extra: { info: string; key: string }) =>
  error({
    message: 'Json body validation failed',
    status: 400,
    ...extra
  })

export const validate = async (model: any, args: any) =>
  await model.validate(args, {
    stripUnknown: true,
    strict: false,
    abortEarly: true
  })

export const withShapeValidation = async (
  func: ApiFunction,
  model: any,
  getArgs: (props: Props) => Record<string, any>,
  props: Props
) => {
  let validArgs = {}
  try {
    validArgs = await validate(model, getArgs(props))
  } catch (err: any) {
    throw validationFailed({
      info: err?.message ?? '',
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

export const useValidation =
  <TArgs = any>(
    getData: (props: Props) => any,
    shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>
  ) =>
  (func: ApiFunction) => {
    const model = yup.object(shapeMaker(yup))
    return (props: Props) => withShapeValidation(func, model, getData, props)
  }
