import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
import zod, { AnyZodObject, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withQueryString = async (
  func: Handler,
  model: AnyZodObject,
  props: Props
) => {
  const [zerr, args] = (await tryit(model.parse)(
    props.request.query
  )) as unknown as [ZodError, any]
  if (zerr) {
    throw error({
      message: 'Query string validation failed',
      status: 400,
      info: zerr.issues
        .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
        .join(', '),
      key: 'err.query-string.failed'
    })
  }
  return await func({
    ...props,
    args: {
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
  return props => withQueryString(func as Handler, model, props)
}
