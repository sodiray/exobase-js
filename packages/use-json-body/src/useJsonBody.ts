import { BadRequestError, NextFunc, Props } from '@exobase/core'
import { isArray, isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

const isZodError = (e: any): e is ZodError => e && e.issues && isArray(e.issues)

export const withJsonBody = async (
  func: NextFunc,
  model: AnyZodObject | ZodArray<any>,
  mapper: (validatedData: any) => any,
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
      ...mapper(args)
    }
  })
}

export const useJsonBody =
  <TArgs extends {}, TProps extends Props = Props>(
    shapeMaker: AnyZodObject | ((z: Zod) => KeyOfType<TArgs, any>),
    mapper: (validatedData: TArgs) => any = x => x
  ) =>
  (
    func: NextFunc<
      TProps & {
        args: TProps['args'] & TArgs
      }
    >
  ): NextFunc<TProps> => {
    const model = isFunction(shapeMaker)
      ? zod.object(shapeMaker(zod))
      : shapeMaker
    return props => withJsonBody(func as NextFunc, model, mapper, props)
  }

export const useJsonArrayBody =
  <
    TArgs extends {},
    TName extends string | number | symbol = string,
    TProps extends Props = Props
  >(
    shapeMaker: AnyZodObject | ((z: Zod) => KeyOfType<TArgs, any>),
    mapper: (validatedData: TArgs[]) => any
  ) =>
  (
    func: NextFunc<
      TProps & {
        args: TProps['args'] & {
          [key in TName]: TArgs[]
        }
      }
    >
  ): NextFunc<TProps> => {
    const model = isFunction(shapeMaker)
      ? zod.array(zod.object(shapeMaker(zod)))
      : zod.array(shapeMaker)
    return props => withJsonBody(func as NextFunc, model, mapper, props)
  }
