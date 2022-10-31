import { AbstractError } from './types'

// Used by ./resposne.ts to detect if a thrown error
// was produced by this module or not
export const ERROR_NAME = 'exobase.error'

export const error = (input: Omit<AbstractError, 'name'>) =>
  ({
    ...input,
    name: ERROR_NAME
  } as AbstractError)
