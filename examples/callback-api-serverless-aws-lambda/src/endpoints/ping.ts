import type { Props } from 'exobase'
import { useLambda } from 'exobase-use-lambda'
import { compose } from 'radash'

type Args = {}
type Services = {}
type Response = {
  message: 'pong'
}

export const pingEndpoint = async ({}: Props<
  Args,
  Services
>): Promise<Response> => ({
  message: 'pong'
})

export default compose(useLambda(), pingEndpoint)
