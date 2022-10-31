import { expect, test } from '@jest/globals'
import { ERROR_NAME } from '../error'

test('do not fail because there are no tests', () => {
  expect(ERROR_NAME).toBe('exobase.error')
})
