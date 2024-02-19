import { BadRequestError, NextFunc, Props } from '@exobase/core'
import { isArray, isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

const isZodError = (e: any): e is ZodError => e && e.issues && isArray(e.issues)

export const withPathParams = async (
  func: NextFunc,
  model: AnyZodObject | ZodArray<any>,
  mapper: (validatedData: any) => any,
  props: Props
) => {
  const [zerr, args] = await tryit(model.parseAsync)(props.request.params)
  if (zerr) {
    if (!isZodError(zerr)) {
      throw new BadRequestError(
        'Path parameter validation failed: ' + zerr.message ?? 'Parse error',
        {
          key: 'err.path-params.parsing',
          cause: zerr
        }
      )
    }
    throw new BadRequestError(
      'Path parameter validation failed: ' +
        zerr.issues
          .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
          .join(', '),
      {
        key: 'err.path-params.failed',
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

export const usePathParams = <TArgs extends {}, TProps extends Props = Props>(
  shapeMaker: AnyZodObject | ((z: Zod) => KeyOfType<TArgs, any>),
  mapper: (validatedData: TArgs) => any = x => x
) => {
  const model = isFunction(shapeMaker)
    ? zod.object(shapeMaker(zod))
    : shapeMaker
  return (
      func: NextFunc<
        TProps & {
          args: TProps['args'] & TArgs
        }
      >
    ): NextFunc<TProps> =>
    props =>
      withPathParams(func as NextFunc, model, mapper, props)
}
