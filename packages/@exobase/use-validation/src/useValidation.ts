import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
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

export const withShapeValidation = async <
  TArgs extends {},
  TProps extends Props
>(
  func: Handler<TProps & { args: TProps['args'] & TArgs }>,
  model: any,
  getArgs: (props: Props) => Record<string, any>,
  props: TProps
) => {
  const [err, validArgs] = await tryit(validate)(model, getArgs(props))
  if (err) {
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

export const useValidation: <TArgs extends {}, TProps extends Props>(
  getData: (props: Props) => any,
  shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>
) => (
  func: Handler<TProps & { args: TProps['args'] & TArgs }>
) => Handler<TProps> = (getData, shapeMaker) => func => {
  const model = yup.object(shapeMaker(yup))
  return props => withShapeValidation(func, model, getData, props)
}
