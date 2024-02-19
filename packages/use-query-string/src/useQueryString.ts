import { BadRequestError, NextFunc, Props } from '@exobase/core'
import { isArray, isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

const isZodError = (e: any): e is ZodError => e && e.issues && isArray(e.issues)

export const withQueryString = async (
  func: NextFunc,
  model: AnyZodObject,
  mapper: (validatedData: any) => any,
  props: Props
) => {
  const [zerr, args] = await tryit(model.parseAsync)(props.request.query)
  if (zerr) {
    if (!isZodError(zerr)) {
      throw new BadRequestError(
        'Query string validation failed: ' + zerr.message ?? 'Parse error',
        {
          key: 'err.query-string.parsing',
          cause: zerr
        }
      )
    }
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
  func: NextFunc<
    TProps & {
      args: TProps['args'] & TArgs
    }
  >
) => NextFunc<TProps> =
  (shapeMaker, mapper = x => x) =>
  func => {
    const model = isFunction(shapeMaker)
      ? zod.object(shapeMaker(zod))
      : shapeMaker
    return props => withQueryString(func as NextFunc, model, mapper, props)
  }
