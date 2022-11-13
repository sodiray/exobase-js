import type { Handler, Props, Request } from '@exobase/core'
import { props, responseFromError, responseFromResult } from '@exobase/core'
import { isString, lowerize, try as tryit } from 'radash'

export type LambdaOptions = {}

export type LambdaFramework = {
  event: AWSLambda.APIGatewayProxyEvent
  context: AWSLambda.Context
}

export async function withLambda(
  func: Handler<Props & { framework: LambdaFramework }>,
  options: LambdaOptions,
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
) {
  const [error, result] = await tryit(func)({
    ...props(makeRequest(event, context)),
    framework: {
      event,
      context
    }
  })
  if (error) {
    console.error(error)
  }

  const response = error ? responseFromError(error) : responseFromResult(result)

  // @link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  return {
    body: JSON.stringify(response.body ?? {}),
    isBase64Encoded: false,
    headers: {
      'content-type': 'application/json',
      ...response.headers
    },
    statusCode: response.status
  }
}

export const useLambda: (
  options?: LambdaOptions
) => (
  func: Handler<Props & { framework: LambdaFramework }>
) => (
  event: AWSLambda.APIGatewayProxyEvent,
  context: AWSLambda.Context
) => Promise<any> = options => func => (event, context) =>
  withLambda(func, options ?? {}, event, context)

// For docs on the shape of the request see
// docs: https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html#apigateway-example-event
// example: https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json
export const makeRequest = (
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
): Request => {
  const headers = lowerize((event.headers as Record<string, string>) ?? {})
  return {
    headers,
    url: event.path,
    path: event.path,
    body: (() => {
      if (!event.body || event.body === '') {
        return {}
      }
      if (event.isBase64Encoded) {
        return JSON.parse(Buffer.from(event.body, 'base64').toString())
      }
      if (isString(event.body)) {
        return JSON.parse(event.body)
      }
      return event.body
    })(),
    method:
      event.requestContext?.httpMethod ??
      event.httpMethod ??
      (event.requestContext as any)?.http?.method ??
      '',
    query: (event.queryStringParameters as Record<string, string>) ?? {},
    ip:
      (event.requestContext as any)?.http?.sourceIp ??
      event.requestContext?.identity?.sourceIp,
    startedAt: Date.now(),
    protocol: event.requestContext.protocol,
    httpVersion: (event.requestContext.protocol.split('/')[1] as string) ?? ''
  }
}
