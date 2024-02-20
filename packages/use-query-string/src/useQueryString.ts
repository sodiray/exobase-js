import { BadRequestError, NextFunc, Props } from '@exobase/core'
import { isArray, isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodError, ZodObject, ZodRawShape } from 'zod'

const isZodError = (e: any): e is ZodError => e && e.issues && isArray(e.issues)

export const withQueryString = async (
  func: NextFunc,
  model: AnyZodObject,
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
      ...args
    }
  })
}

export const useQueryString: <TRawShape extends ZodRawShape>(
  shapeMaker: ZodObject<TRawShape> | ((z: typeof zod) => TRawShape)
) => (
  func: NextFunc<
    Props<{
      args: ZodObject<TRawShape>['_output']
    }>
  >
) => NextFunc<Props> = shapeMaker => func => {
  const model = isFunction(shapeMaker)
    ? zod.object(shapeMaker(zod))
    : shapeMaker
  return props => withQueryString(func as NextFunc, model, props)
}
