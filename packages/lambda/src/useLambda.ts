import _ from 'radash'
import * as uuid from 'uuid'
import * as exo from '@exobase/core'
import { LambdaRequest } from './types'

export type LambdaOptions = {
  callbackWaitsForEmptyEventLoop?: boolean
}

async function lambdaHandler(
  func: exo.ApiFunction,
  options: LambdaOptions,
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
) {

  const rid = `r.id.${uuid.v4().substr(0, 7)}`
  const props: exo.Props = exo.initProps(makeReq(event, context))

  const [error, result] = await _.try<any>(func)(props)
  if (error) {
    console.error(error)
  }

  const response = error
    ? exo.responseFromError(error)
    : exo.responseFromResult(result)

  context.callbackWaitsForEmptyEventLoop = options.callbackWaitsForEmptyEventLoop === false ? false : true

  // @link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  return {
    body: JSON.stringify(response.body ?? {}),
    isBase64Encoded: false,
    headers: {
      'x-rid': rid,
      'content-type': 'application/json',
      ...response.headers
    },
    statusCode: response.status
  }
}

export const useLambda = (options?: LambdaOptions) => (func: exo.ApiFunction) => {
  return _.partial(lambdaHandler, func, options ?? {})
}

const makeReq = (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context): LambdaRequest => {
  const headers = _.lowerize(event.headers ?? {})
  return {
    headers,
    url: event.path,
    body: (() => {
      if (!event.body || event.body === '') {
        return {}
      }
      if (event.isBase64Encoded) {
        return JSON.parse(Buffer.from(event.body, 'base64').toString())
      }
      if (_.isString(event.body)) {
        return JSON.parse(event.body)
      }
      return event.body
    })(),
    method: event.requestContext?.httpMethod ?? event.httpMethod ?? (event.requestContext as any)?.http?.method ?? '',
    query: event.queryStringParameters ?? {},
    ip: (event.requestContext as any)?.http?.sourceIp ?? event.requestContext?.identity?.sourceIp,
    event,
    context
  }
}