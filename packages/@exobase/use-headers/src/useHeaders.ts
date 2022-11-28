import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withHeaders = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  props: Props
) => {
  const [zerr, args] = (await tryit(model.parseAsync)(
    props.request.headers
  )) as unknown as [ZodError, any]
  if (zerr) {
    throw error({
      message: 'Header validation failed',
      status: 400,
      info: zerr.issues
        .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
        .join(', '),
      key: 'err.headers.failed'
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

export const useHeaders: <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: (z: Zod) => KeyOfType<TArgs, any>
) => (
  func: Handler<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => Handler<TProps> = shapeMaker => func => {
  const model = zod.object(shapeMaker(zod))
  return props => withHeaders(func as Handler, model, props)
}
