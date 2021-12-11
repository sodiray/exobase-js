import * as lama from 'aws-lama'
import * as t from './types'


const lambdaFrameworkMapper: t.FrameworkMapper = {
  mapRequestToArgs: async (req, res) => {
    const { event, context } = await lama.toEventContext(req, res)
    return [event, context]
  },
  mapResultToRes: async (req, res, result) => {
    lama.toHttpResponse(result, res)
  }
}

export default lambdaFrameworkMapper
