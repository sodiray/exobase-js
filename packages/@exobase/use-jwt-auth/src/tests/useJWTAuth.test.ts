import { expect, test } from '@jest/globals'
import { withJWTAuth } from '../useJWTAuth'

test('useJWTAuth stop gap', () => {
  expect(withJWTAuth).not.toBeNull()
})
