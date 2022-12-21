import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withJsonBody = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  mapper: (validatedData: any) => any,
  props: Props
) => {
  const [zerr, args] = (await tryit(model.parseAsync)(
    props.request.body
  )) as unknown as [ZodError, any]
  if (zerr) {
    throw error({
      message: 'Json body validation failed',
      status: 400,
      info: zerr.issues
        .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
        .join(', '),
      key: 'err.json-body.failed'
    })
  }
  return await func({
    ...props,
    args: {
      ...props.args,
      ...mapper(args)
    }
  })
}

export const useJsonBody: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: AnyZodObject | ((z: Zod) => KeyOfType<TArgs, any>),
  mapper?: (validatedData: TArgs) => any
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => Handler<TProps> =
  (shapeMaker, mapper = x => x) =>
  func => {
    const model = isFunction(shapeMaker)
      ? zod.object(shapeMaker(zod))
      : shapeMaker
    return props => withJsonBody(func as Handler, model, mapper, props)
  }

export const useJsonArrayBody: <
  TArgs extends {},
  TName extends string | number | symbol = string,
  TProps extends Props = Props
>(
  shapeMaker: AnyZodObject | ((z: Zod) => KeyOfType<TArgs, any>),
  mapper: (validatedData: TArgs[]) => any
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & {
        [key in TName]: TArgs[]
      }
    }
  >
) => Handler<TProps> = (shapeMaker, mapper) => func => {
  const model = isFunction(shapeMaker)
    ? zod.array(zod.object(shapeMaker(zod)))
    : zod.array(shapeMaker)
  return props => withJsonBody(func as Handler, model, mapper, props)
}
