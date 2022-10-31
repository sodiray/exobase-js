import type { ApiFunction, Props } from '@exobase/core'
import { partial } from 'radash'
import { KeyOfType, Yup } from './types'
import { useValidation } from './useValidation'

export const useQueryArgs = partial(
  useValidation,
  (props: Props) => props.request.query
) as <TArgs>(
  shapeMaker: (yup: Yup) => KeyOfType<TArgs, any>
) => (func: ApiFunction) => ApiFunction
