import type { Handler, Props } from '@exobase/core'
import { BadRequestError } from '@exobase/core'
import { isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withHeaders = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  mapper: (validatedData: any) => any,
  props: Props
) => {
  const [zerr, args] = (await tryit(model.parseAsync)(
    props.request.headers
  )) as unknown as [ZodError, any]
  if (zerr) {
    throw new BadRequestError({
      message: 'Header validation failed',
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
      ...mapper(args)
    }
  })
}

export const useHeaders: <TArgs extends {}, TProps extends Props = Props>(
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
    return props => withHeaders(func as Handler, model, mapper, props)
  }
