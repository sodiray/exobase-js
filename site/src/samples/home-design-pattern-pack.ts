import { compose } from 'radash'

const func = _.compose(
  useLambda(),
  useLogging(),
  useSessionAuth(),
  useQueryParam('genre'),
  listMoviesByGenere
)