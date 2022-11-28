import { omit, pick } from 'radash'
import type { Props, Request } from './types'

export type ExobaseBuilder<
  KInitArgs extends any[] = any[],
  KCurrentArgs extends {} = {},
  KCurrentServices extends {} = {},
  KCurrentAuth extends {} = {},
  KCurrentRequest extends Request = Request,
  KCurrentFramework extends {} = {}
> = {
  init: (
    init: (
      func: (...args: any[]) => Promise<any>
    ) => (...args: any[]) => Promise<any>
  ) => Omit<ExobaseBuilder, 'init'>
  root: <
    TInitArgs extends any[],
    TCurrentArgs extends {},
    TCurrentServices extends {},
    TCurrentAuth extends {},
    TCurrentRequest extends Request,
    TCurrentFramework extends {}
  >(
    root: (
      func: (
        props: Props<
          TCurrentArgs,
          TCurrentServices,
          TCurrentAuth,
          TCurrentRequest,
          TCurrentFramework
        >
      ) => Promise<any>
    ) => (...args: TInitArgs) => Promise<any>
  ) => ExobaseBuilder<
    TInitArgs,
    TCurrentArgs,
    TCurrentServices,
    TCurrentAuth,
    TCurrentRequest,
    TCurrentFramework
  >
  hook: <
    TNextArgs extends {},
    TNextServices extends {},
    TNextAuth extends {},
    TNextRequest extends Request,
    TNextFramework extends {},
    TRequiredServices extends KCurrentServices extends TRequiredServices
      ? {}
      : '>>> ERROR: The chain does not contain the required Services to pass to this hook',
    TRequiredAuth extends KCurrentAuth extends TRequiredAuth
      ? {}
      : '>>> ERROR: The chain does not contain the required Auth to pass to this hook',
    TRequiredArgs extends KCurrentArgs extends TRequiredArgs
      ? {}
      : '>>> ERROR: The chain does not contain the required Args to pass to this hook',
    TRequiredRequest extends KCurrentRequest extends TRequiredRequest
      ? Request
      : Request &
          '>>> ERROR: The chain does not contain the required Request to pass to this hook',
    TRequiredFramework extends KCurrentFramework extends TRequiredFramework
      ? {}
      : '>>> ERROR: The chain does not contain the required Framework to pass to this hook'
  >(
    hook: (
      func: (
        props: Props<
          TNextArgs,
          TNextServices,
          TNextAuth,
          TNextRequest,
          TNextFramework
        >
      ) => Promise<any>
    ) => (
      props: Props<
        TRequiredArgs,
        TRequiredServices,
        TRequiredAuth,
        TRequiredRequest,
        TRequiredFramework
      >
    ) => Promise<any>
  ) => Omit<
    ExobaseBuilder<
      KInitArgs,
      TNextArgs & KCurrentArgs,
      TNextServices & KCurrentServices,
      TNextAuth & KCurrentAuth,
      TNextRequest & KCurrentRequest,
      TNextFramework & KCurrentFramework
    >,
    'init' | 'root'
  >
  endpoint: <
    TResult,
    TRequiredServices extends KCurrentServices extends TRequiredServices
      ? {}
      : '>>> ERROR: The chain does not contain the required Services to pass to this endpoint',
    TRequiredAuth extends KCurrentAuth extends TRequiredAuth
      ? {}
      : '>>> ERROR: The chain does not contain the required Auth to pass to this endpoint',
    TRequiredArgs extends KCurrentArgs extends TRequiredArgs
      ? {}
      : '>>> ERROR: The chain does not contain the required Args to pass to this endpoint',
    TRequiredRequest extends KCurrentRequest extends TRequiredRequest
      ? Request
      : Request &
          '>>> ERROR: The chain does not contain the required Request to pass to this endpoint',
    TRequiredFramework extends KCurrentFramework extends TRequiredFramework
      ? {}
      : '>>> ERROR: The chain does not contain the required Framework to pass to this endpoint'
  >(
    handler: (
      props: Props<
        TRequiredArgs,
        TRequiredServices,
        TRequiredAuth,
        TRequiredRequest,
        TRequiredFramework
      >
    ) => Promise<TResult>
  ) => (...args: KInitArgs) => Promise<TResult>
  raw: {
    init: KInitArgs
    args: KCurrentArgs
    services: KCurrentServices
    auth: KCurrentAuth
    request: KCurrentRequest
    framework: KCurrentFramework
  }
}

export const chain = <
  KInitArgs extends any[] = any[],
  KCurrentArgs extends {} = {},
  KCurrentServices extends {} = {},
  KCurrentAuth extends {} = {},
  KCurrentRequest extends Request = Request,
  KCurrentFramework extends {} = {}
>(
  funcs: Function[] = []
): ExobaseBuilder<
  KInitArgs,
  KCurrentArgs,
  KCurrentServices,
  KCurrentAuth,
  KCurrentRequest,
  KCurrentFramework
> => ({
  init: (
    init: (
      func: (...args: any[]) => Promise<any>
    ) => (...args: any[]) => Promise<any>
  ) => {
    return { ...chain([init]), init: undefined } as Omit<ExobaseBuilder, 'init'>
  },
  root: <
    TInitArgs extends any[],
    TCurrentArgs extends {},
    TCurrentServices extends {},
    TCurrentAuth extends {},
    TCurrentRequest extends Request,
    TCurrentFramework extends {}
  >(
    root: (
      func: (
        props: Props<
          TCurrentArgs,
          TCurrentServices,
          TCurrentAuth,
          TCurrentRequest,
          TCurrentFramework
        >
      ) => Promise<any>
    ) => (...args: TInitArgs) => Promise<any>
  ) => {
    return chain([...funcs, root]) as ExobaseBuilder<
      TInitArgs,
      TCurrentArgs,
      TCurrentServices,
      TCurrentAuth,
      TCurrentRequest,
      TCurrentFramework
    >
  },
  hook: <
    TNextArgs extends {},
    TNextServices extends {},
    TNextAuth extends {},
    TNextRequest extends Request,
    TNextFramework extends {},
    TRequiredServices extends KCurrentServices extends TRequiredServices
      ? {}
      : '>>> ERROR: The chain does not contain the required Services to pass to this hook',
    TRequiredAuth extends KCurrentAuth extends TRequiredAuth
      ? {}
      : '>>> ERROR: The chain does not contain the required Auth to pass to this hook',
    TRequiredArgs extends KCurrentArgs extends TRequiredArgs
      ? {}
      : '>>> ERROR: The chain does not contain the required Args to pass to this hook',
    TRequiredRequest extends KCurrentRequest extends TRequiredRequest
      ? Request
      : Request &
          '>>> ERROR: The chain does not contain the required Request to pass to this hook',
    TRequiredFramework extends KCurrentFramework extends TRequiredFramework
      ? {}
      : '>>> ERROR: The chain does not contain the required Framework to pass to this hook'
  >(
    hook: (
      func: (
        props: Props<
          TNextArgs,
          TNextServices,
          TNextAuth,
          TNextRequest,
          TNextFramework
        >
      ) => Promise<any>
    ) => (
      props: Props<
        TRequiredArgs,
        TRequiredServices,
        TRequiredAuth,
        TRequiredRequest,
        TRequiredFramework
      >
    ) => Promise<any>
  ) => {
    return omit(
      chain<
        KInitArgs,
        TNextArgs & KCurrentArgs,
        TNextServices & KCurrentServices,
        TNextAuth & KCurrentAuth,
        TNextRequest & KCurrentRequest,
        TNextFramework & KCurrentFramework
      >([...funcs, hook]),
      ['init', 'root']
    )
  },
  endpoint: <
    TResult,
    TRequiredServices extends KCurrentServices extends TRequiredServices
      ? {}
      : '>>> ERROR: The chain does not contain the required Services to pass to this endpoint',
    TRequiredAuth extends KCurrentAuth extends TRequiredAuth
      ? {}
      : '>>> ERROR: The chain does not contain the required Auth to pass to this endpoint',
    TRequiredArgs extends KCurrentArgs extends TRequiredArgs
      ? {}
      : '>>> ERROR: The chain does not contain the required Args to pass to this endpoint',
    TRequiredRequest extends KCurrentRequest extends TRequiredRequest
      ? Request
      : Request &
          '>>> ERROR: The chain does not contain the required Request to pass to this endpoint',
    TRequiredFramework extends KCurrentFramework extends TRequiredFramework
      ? {}
      : '>>> ERROR: The chain does not contain the required Framework to pass to this endpoint'
  >(
    endpoint: (
      props: Props<
        TRequiredArgs,
        TRequiredServices,
        TRequiredAuth,
        TRequiredRequest,
        TRequiredFramework
      >
    ) => Promise<TResult>
  ) => {
    return [...funcs, endpoint].reverse().reduce((acc, fn) => fn(acc)) as (
      ...args: KInitArgs
    ) => Promise<TResult>
  },
  raw: {
    init: {} as KInitArgs,
    args: {} as KCurrentArgs,
    services: {} as KCurrentServices,
    auth: {} as KCurrentAuth,
    request: {} as KCurrentRequest,
    framework: {} as KCurrentFramework
  }
})

export const exo = () => pick(chain(), ['init', 'root'])
