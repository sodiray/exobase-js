import type { Props } from '@exobase/core'
import { hook } from '@exobase/core'
import { tryit } from 'radash'

export const useCatch = <TProps extends Props = Props>(
  handler: (props: TProps, error: null | Error) => any
) =>
  hook<TProps, Props>(func => async props => {
    const [err, result] = await tryit(func)(props)
    return err ? handler(props, err) : result
  })
