import { hook, Props, response, Response } from '@exobase/core'
import { tryit } from 'radash'

export const useCatch = <TProps extends Props = Props>(
  handler: (props: TProps, response: Response) => any
) =>
  hook<TProps, Props>(func => async props => {
    const [error, result] = await tryit(func)(props)
    const res = response(error, result)
    return res.error ? handler(props, res) : res
  })
