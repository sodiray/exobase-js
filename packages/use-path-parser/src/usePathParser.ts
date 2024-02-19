import type { NextFunc, Props } from '@exobase/core'
import { ParamParser } from './param-parser'

export async function withPathParser<TProps extends Props>(
  func: NextFunc<TProps & { args: TProps['args'] & Record<string, string> }>,
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

export const usePathParser = <TProps extends Props>(template: string) => {
  const parser = ParamParser(template)
  return (
    func: NextFunc<TProps & { args: TProps['args'] & Record<string, string> }>
  ): NextFunc<TProps> => {
    return props => withPathParser(func, parser, props)
  }
}
