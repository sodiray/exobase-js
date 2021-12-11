import * as t from './types'

const expressFrameworkMapper: t.FrameworkMapper = {
  mapRequestToArgs: async (req, res) => ([ req, res ]),
  mapResultToRes: async () => void 0
}

export default expressFrameworkMapper
