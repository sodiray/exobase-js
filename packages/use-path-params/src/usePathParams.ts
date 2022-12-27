import type { Handler, Props } from '@exobase/core'
import { error } from '@exobase/core'
import { isFunction, tryit } from 'radash'
import zod, { AnyZodObject, ZodArray, ZodError } from 'zod'

type Zod = typeof zod
type KeyOfType<T, Value> = { [P in keyof T]: Value }

export const withPathParams = async (
  func: Handler,
  model: AnyZodObject | ZodArray<any>,
  mapper: (validatedData: any) => any,
  props: Props
) => {
  const [zerr, args] = (await tryit(model.parseAsync)(
    props.request.params
  )) as unknown as [ZodError, any]
  if (zerr) {
    throw error({
      message: 'Path parameter validation failed',
      status: 400,
      info: zerr.issues
        .map(e => `${e.path.join('.')}: ${e.message.toLowerCase()}`)
        .join(', '),
      key: 'err.path-params.invalid'
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

export const usePathParams: <TArgs extends {}, TProps extends Props = Props>(
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
    return props => withPathParams(func as Handler, model, mapper, props)
  }
