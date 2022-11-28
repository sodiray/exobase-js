import { describe, expect, test } from '@jest/globals'
import { tryit } from 'radash'
import { useAuthorization } from '../index'

describe('useAuthorization function', () => {
  test('calls endpoint when sufficent permissions exist', async () => {
    const sut = useAuthorization({
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
    const sut = useAuthorization({
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
