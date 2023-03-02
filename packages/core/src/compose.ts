import { Handler, Props } from './types'

export type InitHook = <TRequiredProps extends Props = Props>(
  func: Handler<TRequiredProps>
) => (...args: any[]) => Promise<any>

export type RootHook = <TRequiredProps extends Props = Props>(
  func: Handler<TRequiredProps>
) => (...args: any[]) => Promise<any>

export type Hook = <
  TGivenProps extends Props = Props,
  TRequiredProps extends Props = Props
>(
  func: Handler<TRequiredProps>
) => (props: Props<TGivenProps>) => Promise<any>
