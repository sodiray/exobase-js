import { BadRequestError, NextFunc, Props } from '@exobase/core'
import { isArray, isFunction, tryit } from 'radash'
import zod, {
  AnyZodObject,
  ZodArray,
  ZodError,
  ZodObject,
  ZodRawShape,
  ZodTypeAny
} from 'zod'

const isZodError = (e: any): e is ZodError => e && e.issues && isArray(e.issues)

export const withJsonBody = async (
  func: NextFunc,
  name: string | undefined,
  model: AnyZodObject | ZodArray<any>,
  props: Props
) => {
  const [zerr, args] = await tryit(model.parseAsync)(props.request.body)
  if (zerr) {
    if (!isZodError(zerr)) {
      throw new BadRequestError(
        'Json body validation failed: ' + zerr.message ?? 'Parse error',
        {
          key: 'err.json-body.parsing',
          cause: zerr
        }
      )
    }
    throw new BadRequestError(
      'Json body validation failed: ' +
        zerr.issues
          .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
          .join(', '),
      {
        key: 'err.json-body.failed',
        cause: zerr
      }
    )
  }
  return await func({
    ...props,
    args: {
      ...props.args,
      ...(name ? { [name]: args } : args)
    }
  })
}

export const useJsonBody: <TRawShape extends ZodRawShape>(
  shapeMaker: ZodObject<TRawShape> | ((z: typeof zod) => TRawShape)
) => (
  func: NextFunc<
    Props<ZodObject<TRawShape>['_output']>
  >
) => NextFunc<Props> = shapeMaker => func => {
  const model = isFunction(shapeMaker)
    ? zod.object(shapeMaker(zod))
    : shapeMaker
  return props => withJsonBody(func as NextFunc, undefined, model, props)
}

export const useJsonArrayBody: <
  TString extends string,
  TShape extends ZodTypeAny
>(
  name: TString,
  shapeMaker: ZodArray<TShape> | ((z: typeof zod) => TShape)
) => (
  func: NextFunc<
    Props<{
      [key in TString]: ZodArray<TShape>['_output']
    }>
  >
) => NextFunc<Props> = (name, shapeMaker) => func => {
  const model = isFunction(shapeMaker) ? zod.array(shapeMaker(zod)) : shapeMaker
  return props => withJsonBody(func as NextFunc, name, model, props)
}
