import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
import zod, { AnyZodObject, ZodArray } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withHeaderArgs = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  name: string | null,
  props: Props
) => {
  const [err, args] = await tryit(model.parse)(props.request.headers)
  if (err)
    throw error({
      message: 'Header validation failed',
      status: 400,
      info: err?.message ?? '',
      key: 'err.use-header-args.failed'
    })
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

export const useHeaderArgs: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: (z: Zod) => KeyOfType<TArgs, any>
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => Handler<TProps> = shapeMaker => func => {
  const model = zod.object(shapeMaker(zod))
  return props => withHeaderArgs(func as Handler, model, null, props)
}
