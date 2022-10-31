import { compose } from 'radash'
import type { Props } from 'exobase'
import { useNext } from 'exobase-use-next'

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

export default compose(useNext(), pingEndpoint)
