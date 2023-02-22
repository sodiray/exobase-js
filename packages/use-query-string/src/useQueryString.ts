import { BadRequestError, Handler, Props } from '@exobase/core'
import { isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withQueryString = async (
  func: Handler,
  model: AnyZodObject,
  mapper: (validatedData: any) => any,
  props: Props
) => {
  const [zerr, args] = (await tryit(model.parseAsync)(
    props.request.query
  )) as unknown as [ZodError, any]
  if (zerr) {
    throw new BadRequestError(
      'Query string validation failed: ' +
        zerr.issues
          .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
          .join(', '),
      {
        key: 'err.query-string.failed',
        cause: zerr
      }
    )
  }
  return await func({
    ...props,
    args: {
      ...props.args,
      ...mapper(args)
    }
  })
}

export const useQueryString: <TArgs extends {}, TProps extends Props = Props>(
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
    return props => withQueryString(func as Handler, model, mapper, props)
  }
