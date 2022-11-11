import { describe, expect, test } from '@jest/globals'
import exo from '../builder'
import { Props, Request, Response } from '../types'

// First ~220 lines here are just mocking out fake
// hooks and types to use in the one test at the
// end.

type Database = {
  connect: () => Promise<void>
}

type Args = {
  message: string
}

type Services = {
  database: Database
}

type AWSFramework = {
  event: AWSLambda.APIGatewayProxyEvent
  context: AWSLambda.Context
}

const addTweet = async (
  props: Props<
    Args & { id: string },
    Services & {
      logger: {
        name: string
      }
    },
    TokenAuth,
    Request,
    AWSFramework
  >
) => props

type KeyOfType<T, Value> = { [P in keyof T]: Value }

const useLambda: (
  options?: any
) => (
  func: (props: Props<{}, {}, {}, Request, AWSFramework>) => Promise<any>
) => (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
) => Promise<any> = options => func => async (event, context) => {
  return await func({
    args: {},
    services: {},
    auth: {},
    response: {} as Response,
    request: {} as Request,
    framework: {
      event,
      context
    }
  })
}

const useJsonArgs: <
  TArgs extends {},
  TGivenArgs extends {} = {},
  TGivenServices extends {} = {},
  TGivenAuth extends {} = {},
  TGivenRequest extends Request = Request,
  TGivenFramework extends {} = {}
>(
  shapeMaker: (yup: any) => KeyOfType<TArgs, any>
) => (
  func: (
    props: Props<
      TArgs & TGivenArgs,
      TGivenServices,
      TGivenAuth,
      TGivenRequest,
      TGivenFramework
    >
  ) => Promise<any>
) => (
  props: Props<
    TGivenArgs,
    TGivenServices,
    TGivenAuth,
    TGivenRequest,
    TGivenFramework
  >
) => Promise<any> = shapeMaker => func => async props => {
  return await func({
    ...props,
    args: {
      ...props.args,
      ...shapeMaker({})
    }
  })
}

type TokenAuth = { token: { iss: string } }

const useAuth: <
  TGivenServices extends {
    database: Database
  },
  TGivenArgs extends {} = {},
  TGivenAuth extends {} = {},
  TGivenRequest extends Request = Request,
  TGivenFramework extends {} = {}
>() => (
  func: (
    props: Props<
      TGivenArgs,
      TGivenServices,
      TGivenAuth & TokenAuth,
      TGivenRequest,
      TGivenFramework
    >
  ) => Promise<any>
) => (
  props: Props<
    TGivenArgs,
    TGivenServices,
    TGivenAuth,
    TGivenRequest,
    TGivenFramework
  >
) => Promise<any> = () => func => async props => {
  return await func({
    ...props,
    auth: {
      ...props.auth,
      token: {
        iss: 'token.iss.mock'
      }
    }
  })
}

const useLogger =
  () =>
  (func: (...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    // override console.log
    return await func(...args)
  }

const useServices: <
  TServices extends {},
  TGivenArgs extends {} = {},
  TGivenServices extends {} = {},
  TGivenAuth extends {} = {},
  TRequest extends Request = Request,
  TFramework extends {} = {}
>(
  services: TServices
) => (
  func: (
    props: Props<
      TGivenArgs,
      TServices & TGivenServices,
      TGivenAuth,
      TRequest,
      TFramework
    >
  ) => Promise<any>
) => (
  props: Props<TGivenArgs, TGivenServices, TGivenAuth, TRequest, TFramework>
) => Promise<any> = services => func => async props => {
  return await func({
    ...props,
    services: {
      ...props.services,
      ...services
    }
  })
}

const useLambdaLogger: <
  TGivenFramework extends {
    event: AWSLambda.APIGatewayEvent
    context: AWSLambda.Context
  },
  TGivenArgs extends {} = {},
  TGivenServices extends {} = {},
  TGivenAuth extends {} = {},
  TGivenRequest extends Request = Request
>(
  name: string
) => (
  func: (
    props: Props<
      TGivenArgs,
      TGivenServices & {
        logger: { name: string }
      },
      TGivenAuth,
      TGivenRequest,
      TGivenFramework
    >
  ) => Promise<any>
) => (
  props: Props<
    TGivenArgs,
    TGivenServices,
    TGivenAuth,
    TGivenRequest,
    TGivenFramework
  >
) => Promise<any> = name => func => async props => {
  return await func({
    ...props,
    services: {
      ...props.services,
      logger: {
        name
      }
    }
  })
}

describe('exo function builder', () => {
  test('fully built function builds correct types', async () => {
    const handler = exo()
      .init(useLogger())
      .root(useLambda())
      .hook(useLambdaLogger('lambda.logger'))
      .hook(
        useJsonArgs<Args>(yup => ({
          message: 'hello'
        }))
      )
      .hook(
        useJsonArgs<{ id: string }>(yup => ({
          id: 't.user.w91f0s2lsav7amo2'
        }))
      )
      .hook(
        useServices({
          database: 'database' as unknown as Database
        })
      )
      .hook(useAuth())
      .endpoint(addTweet)
    const result = await handler(
      {
        id: 'aws.api-gateway.proxy.event'
      } as unknown as AWSLambda.APIGatewayProxyEvent,
      { id: 'aws.context' } as unknown as AWSLambda.Context
    )
    expect(result.args.message).toEqual('hello')
    expect(result.args.id).toEqual('t.user.w91f0s2lsav7amo2')
    expect(result.framework).toEqual({
      event: {
        id: 'aws.api-gateway.proxy.event'
      },
      context: { id: 'aws.context' }
    })
    expect(result.services.database).toEqual('database')
    expect(result.services.logger.name).toEqual('lambda.logger')
    expect(result.auth.token.iss).toEqual('token.iss.mock')
  })
})
