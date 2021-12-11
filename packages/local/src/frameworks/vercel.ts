import * as t from './types'

/**
 * The Vercel request and response is similar enough
 * to the express types (which its built from) that
 * this will work for now.
 */
const vercelFrameworkMapper: t.FrameworkMapper = {
  mapRequestToArgs: async (req, res) => ([ req, res ]),
  mapResultToRes: async () => void 0
}

export default vercelFrameworkMapper
