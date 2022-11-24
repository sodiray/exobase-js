import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
import zod, { AnyZodObject, ZodArray } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

const validationFailed = (extra: { info: string; key: string }) =>
  error({
    message: 'Query validation failed',
    status: 400,
    ...extra
  })

export const withQueryString = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  name: string | null,
  props: Props
) => {
  const [err, args] = await tryit(model.parse)(props.request.query)
  if (err) {
    throw validationFailed({
      info: err?.message ?? '',
      key: 'err.use-query-args.failed'
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

export const useQueryString: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: (z: Zod) => KeyOfType<TArgs, any>
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => Handler<TProps> = shapeMaker => func => {
  const model = zod.object(shapeMaker(zod))
  return props => withQueryString(func as Handler, model, null, props)
}
