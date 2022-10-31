import { expect, test } from '@jest/globals'
import { withNext } from '../useNext'

test('useNext stop gap', () => {
  expect(withNext).not.toBeNull()
})
