import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withJsonBody = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  name: string | null,
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
        .map(e => `${e.path.join('.')} ${e.message.toLowerCase()}`)
        .join(', '),
      key: 'err.json-body.failed'
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

export const useJsonBody: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: (z: Zod) => KeyOfType<TArgs, any>
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => Handler<TProps> = shapeMaker => func => {
  const model = zod.object(shapeMaker(zod))
  return props => withJsonBody(func as Handler, model, null, props)
}

export const useJsonArrayBody: <
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
  return props => withJsonBody(func as Handler, model, name, props)
}
