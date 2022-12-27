import { defaultResponse } from './response'
import * as t from './types'

export const props = (request: t.Request): t.Props => ({
  auth: {},
  args: {},
  services: {},
  response: defaultResponse,
  request,
  framework: {}
})
