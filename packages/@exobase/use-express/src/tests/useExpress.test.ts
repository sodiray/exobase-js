import { expect, test } from '@jest/globals'
import { withExpress } from '../useExpress'

test('useExpress stop gap', () => {
  expect(withExpress).not.toBeNull()
})
