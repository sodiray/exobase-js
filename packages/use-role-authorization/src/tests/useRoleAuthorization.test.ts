import { describe, expect, test } from '@jest/globals'
import { tryit } from 'radash'
import { useRoleAuthorization } from '../index'

describe('useRoleAuthorization function', () => {
  test('calls endpoint when sufficent role exist', async () => {
    const sut = useRoleAuthorization({
      roles: (p: any) => p.auth.user.roles,
      require: ['admin', 'super-admin']
    })
    const result = await sut(async () => 'success')({
      auth: {
        user: {
          roles: ['admin', 'super-admin', 'contributor', 'user']
        }
      }
    } as any)
    expect(result).toBe('success')
  })
  test('throws unauthorized error when roles are not met', async () => {
    const sut = useRoleAuthorization({
      roles: (p: any) => p.auth.user.roles,
      require: 'admin'
    })
    const [err] = await tryit(() =>
      sut(async () => 'success')({
        auth: {
          user: {
            roles: ['user']
          }
        }
      } as any)
    )()
    expect(err).not.toBeNull()
    expect(err!.message).toBe('Not Authorized')
  })
})
