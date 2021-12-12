import _ from 'radash'
import * as uuid from 'uuid'
import { VercelRequest, VercelResponse } from '@vercel/node'
import * as exo from '@exobase/core'


async function vercelHandler(
  func: exo.ApiFunction,
  req: VercelRequest,
  res: VercelResponse
) {

  const rid = `r.id.${uuid.v4().substr(0, 7)}`
  const props: exo.Props = exo.initProps(makeReq(req))

  console.debug({ message: 'Exo:Vercel Incoming request props', props })

  const [error, result] = await _.tryit<any>(func)(props)

  console.debug({ message: 'Exo:Vercel Function result', result })

  if (error) {
    console.error(error)
  }

  const response = error
    ? exo.responseFromError(error)
    : exo.responseFromResult(result)

  console.debug({ message: 'Exo:Vercel Generated response', response })

  setResponse(res, rid, response)
}

export const useVercel = () => (func: exo.ApiFunction) => _.partial(vercelHandler, func)

export function setResponse(
  res: VercelResponse,
  rid: string,
  response: exo.Response
) {
  const {
    json,
    status = 200,
    headers = {},
  } = response as exo.Response
  for (const [key, val] of Object.entries(headers)) {
    res.setHeader(key, val)
  }
  console.log('>> json')
  console.log(JSON.stringify(json))
  res.setHeader('x-request-id', rid)
  res.status(status).json(json)
}

const makeReq = (req: VercelRequest): exo.Request => ({
  headers: req.headers,
  url: req.url ?? '',
  body: req.body,
  cookies: req.cookies,
  method: req.method,
  query: req.query as Record<string, string>,
})
