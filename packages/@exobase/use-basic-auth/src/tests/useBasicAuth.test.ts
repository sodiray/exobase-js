import { expect, test } from '@jest/globals'
import { withBasicAuth } from '../useBasicAuth'

test('useBasicAuth stop gap', () => {
  expect(withBasicAuth).not.toBeNull()
})
