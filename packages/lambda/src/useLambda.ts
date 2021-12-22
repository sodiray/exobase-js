import _ from 'radash'
import * as uuid from 'uuid'
import * as exo from '@exobase/core'


const withErrorLogging = <T extends Function>(func: T): T => {
  const withError = async (...args: any[]) => {
    try {
      return await func(...args)
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  return withError as any as T
}

async function lambdaHandler(
  func: exo.ApiFunction,
  event: AWSLambda.APIGatewayEvent,
  context: AWSLambda.Context
) {

  const rid = `r.id.${uuid.v4().substr(0, 7)}`
  const props: exo.Props = exo.initProps(makeReq(event, context))

  console.debug({ message: 'Exo:Lambda Incoming request props', props })

  const [error, result] = await _.try<any>(func)(props)

  console.debug({ message: 'Exo:Lambda Function result', result })

  if (error) {
    console.error(error)
  }

  const response = error
    ? exo.responseFromError(error)
    : exo.responseFromResult(result)

  console.debug({ message: 'Exo:Lambda Generated response', response })

  // @link https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
  const lambdaResponse = {
    cookies: response.cookies,
    body: JSON.stringify(response),
    isBase64Encoded: false,
    headers: {
      ...response.headers,
      'x-rid': rid,
      'content-type': 'application/json'
    },
    statusCode: response.status
  }

  console.debug({ message: 'Exo:Lambda Generated lambda response', response })

  return lambdaResponse
}

export const useLambda = () => (func: exo.ApiFunction) => {
  return _.partial(withErrorLogging(lambdaHandler), func)
}

const makeReq = (event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context): exo.Request => {
  const headers = _.lowerize(event.headers ?? {})
  return {
    headers,
    url: '',
    body: event.body,
    cookies: getCookiesFromHeader(headers),
    method: event.requestContext?.httpMethod,
    query: event.queryStringParameters ?? {}
  }
}

const getCookiesFromHeader = (headers: Record<string, string | string[]>) => {

  if (!headers || !headers.cookie) {
    return {}
  }

  const cookies = headers.cookie as string

  // Split a cookie string in an array (Originally found http://stackoverflow.com/a/3409200/1427439)
  return cookies.split(';').reduce((acc, cookie) => {
    const parts = cookie.split('=')
    const key = parts.shift().trim()
    const value = decodeURI(parts.join('='))
    return !!key ? { ...acc, [key]: value } : acc
  }, {} as Record<string, string>)
}
