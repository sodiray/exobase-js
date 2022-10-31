import { expect, test } from '@jest/globals'
import { withCors } from '../useCors'

test('useCors stop gap', () => {
  expect(withCors).not.toBeNull()
})
