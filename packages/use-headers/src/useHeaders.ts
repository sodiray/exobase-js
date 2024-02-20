import { BadRequestError, NextFunc, Props } from '@exobase/core'
import { isArray, isFunction, tryit } from 'radash'
import zod, {
  AnyZodObject,
  ZodArray,
  ZodError,
  ZodObject,
  ZodRawShape
} from 'zod'

const isZodError = (e: any): e is ZodError => e && e.issues && isArray(e.issues)

export const withHeaders = async (
  func: NextFunc,
  model: AnyZodObject | ZodArray<any>,
  props: Props
) => {
  const [zerr, args] = await tryit(model.parseAsync)(props.request.headers)
  if (zerr) {
    if (!isZodError(zerr)) {
      throw new BadRequestError(
        'Header validation failed: ' + zerr.message ?? 'Parse error',
        {
          key: 'err.headers.parsing',
          cause: zerr
        }
      )
    }
    throw new BadRequestError(
      'Header validation failed: ' +
        zerr.issues
          .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
          .join(', '),
      {
        key: 'err.headers.failed',
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

export const useHeaders: <TRawShape extends ZodRawShape>(
  shapeMaker: ZodObject<TRawShape> | ((z: typeof zod) => TRawShape)
) => (
  func: NextFunc<
    Props<ZodObject<TRawShape>['_output']>
  >
) => NextFunc<Props> = shapeMaker => func => {
  const model = isFunction(shapeMaker)
    ? zod.object(shapeMaker(zod))
    : shapeMaker
  return props => withHeaders(func as NextFunc, model, props)
}
