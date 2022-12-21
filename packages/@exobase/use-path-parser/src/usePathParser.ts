import type { Handler, Props } from '@exobase/core'
import { ParamParser } from './param-parser'

export async function withPathParser<TProps extends Props>(
  func: Handler<TProps & { args: TProps['args'] & Record<string, string> }>,
  parser: ParamParser,
  props: TProps
) {
  const params = parser.parse(props.request.path)
  return await func({
    ...props,
    request: {
      ...props.request,
      params: {
        ...props.request.params,
        ...params
      }
    }
  })
}

export const usePathParser: <TProps extends Props>(
  template: string
) => (
  func: Handler<TProps & { args: TProps['args'] & Record<string, string> }>
) => Handler<TProps> = template => {
  const parser = ParamParser(template)
  return func => props => withPathParser(func, parser, props)
}
