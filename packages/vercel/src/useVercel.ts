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

  const [error, result] = await _.tryit<any>(func)(props)

  const respond = _.partial(setResponse, res, rid)

  if (error) {
    console.error(error)
  }

  const response = error
    ? exo.responseFromError(error)
    : exo.responseFromResult(result)

  respond(response)
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
  res.status(status)
  for (const [key, val] of Object.entries(headers)) {
    res.setHeader(key, val)
  }
  res.setHeader('x-request-id', rid)
  res.json(json)
}

const makeReq = (req: VercelRequest): exo.Request => ({
  headers: req.headers,
  url: req.url ?? '',
  body: req.body,
  cookies: req.cookies,
  method: req.method,
  query: req.query as Record<string, string>,
})
