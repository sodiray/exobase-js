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

export const withPathParams = async (
  func: NextFunc,
  model: AnyZodObject | ZodArray<any>,
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
      ...args
    }
  })
}

export const usePathParams: <TRawShape extends ZodRawShape>(
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
  return props => withPathParams(func as NextFunc, model, props)
}
