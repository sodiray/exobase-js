import { compose } from 'radash'
import type { Props } from '@exobase/core'
import db from '~/db'
import type { Movie } from '~/types'

type Args = {
  genre: string
}

type Response = {
  movies: Movie[]
}

export const listMoviesInGenre = async (props: Props<Args>): Promise<Response> => {
  const movies = await db.movies.find({ genre: props.args.genre })
  return {
    movies
  }
}

export default compose(
  useLambda(),
  useSessionAuth(),
  useQueryArg('genre'),
  listMoviesInGenre
)