import type { Handler, Props } from '@exobase/core'
import { KeyOfType, Yup } from './types'
import { useValidation } from './useValidation'

export const useJsonArgs: <TArgs extends {}, TProps extends Props>(
  shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>
) => (
  func: Handler<TProps & { args: TProps['args'] & TArgs }>
) => Handler<TProps> = shapeMaker =>
  useValidation(props => props.request.body, shapeMaker)
