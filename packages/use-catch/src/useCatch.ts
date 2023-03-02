import type { Props } from '@exobase/core'
import { hook, isResponse } from '@exobase/core'
import { tryit } from 'radash'

export const useCatch = <TProps extends Props = Props>(
  handler: (props: TProps, error: null | Error) => any
) =>
  hook<TProps, Props>(func => async props => {
    const [err, result] = await tryit(func)(props)
    const getError = () => {
      if (err) return err
      if (isResponse(result) && result.error) return result.error
      return null
    }
    const error = getError()
    return error ? handler(props, error) : result
  })
