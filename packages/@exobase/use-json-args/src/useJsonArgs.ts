import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
import zod, { AnyZodObject, ZodArray } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withJsonArgs = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  name: string | null,
  props: Props
) => {
  const [err, args] = await tryit(model.parse)(props.request.body)
  if (err) {
    throw error({
      message: 'Json body validation failed',
      status: 400,
      info: err?.message ?? '',
      key: 'err.use-json-args.failed'
    })
  }
  return await func({
    ...props,
    args: name
      ? {
          ...props.args,
          [name]: args
        }
      : {
          ...props.args,
          ...args
        }
  })
}

export const useJsonArgs: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: (z: Zod) => KeyOfType<TArgs, any>
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => Handler<TProps> = shapeMaker => func => {
  const model = zod.object(shapeMaker(zod))
  return props => withJsonArgs(func as Handler, model, null, props)
}

export const useJsonArrayArgs: <
  TArgs extends {},
  TName extends string | number | symbol = string,
  TProps extends Props = Props
>(
  name: string,
  shapeMaker: (z: Zod) => KeyOfType<TArgs, any>
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & {
        [key in TName]: TArgs[]
      }
    }
  >
) => Handler<TProps> = (name, shapeMaker) => func => {
  const model = zod.array(zod.object(shapeMaker(zod)))
  return props => withJsonArgs(func as Handler, model, name, props)
}
