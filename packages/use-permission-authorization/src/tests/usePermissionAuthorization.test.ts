import { describe, expect, test } from '@jest/globals'
import { tryit } from 'radash'
import { usePermissionAuthorization } from '../index'

describe('usePermissionAuthorization function', () => {
  test('calls endpoint when sufficent permissions exist', async () => {
    const sut = usePermissionAuthorization({
      permissions: (p: any) => p.auth.user.permissions,
      require: 'allow::read::com.github/rayepps/exobase-js/settings'
    })
    const result = await sut(async () => 'success')({
      auth: {
        user: {
          permissions: ['allow::*::com.github/rayepps/exobase-js/settings']
        }
      }
    } as any)
    expect(result).toBe('success')
  })
  test('throws unauthorized error when permissions are not met', async () => {
    const sut = usePermissionAuthorization({
      permissions: (p: any) => p.auth.user.permissions,
      require: 'allow::write::com.github/rayepps/exobase-js/settings'
    })
    const [err] = await tryit(() =>
      sut(async () => 'success')({
        auth: {
          user: {
            permissions: ['allow::read::com.github/rayepps/exobase-js/settings']
          }
        }
      } as any)
    )()
    expect(err).not.toBeNull()
    expect(err!.message).toBe('Not Authorized')
  })
})
