import { partial } from 'radash'
import type { ApiFunction, Props } from '@exobase/core'
import { KeyOfType, Yup } from './types'
import { useValidation } from './useValidation'

export const useHeaderArgs = partial(
  useValidation,
  (props: Props) => props.request.headers
) as <TArgs = any>(
  shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>
) => (func: ApiFunction) => ApiFunction
