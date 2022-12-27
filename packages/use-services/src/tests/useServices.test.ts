import { describe, expect, jest, test } from '@jest/globals'
import { useServices } from '../index'

describe('useServices hook', () => {
  test('passess all given services to endpoint', async () => {
    const services = {
      octokit: async () => 'o-service',
      redis: 'r-service'
    }
    const endpoint = jest.fn((props: any) => props.services)
    const sut = useServices(services)
    const result = await sut(endpoint)({
      services: {}
    } as any)
    expect(result.octokit).toBe('o-service')
    expect(result.redis).toBe('r-service')
  })

  test('withServices passess existing services', async () => {
    const services = {
      octokit: () => 'o-service',
      redis: () => 'r-service'
    }
    const existingServices = {
      database: 'd-service'
    }
    const endpoint = jest.fn((props: any) => props.services)
    const sut = useServices(services)
    const result = await sut(endpoint)({
      services: existingServices
    } as any)
    expect(result.octokit).toBe('o-service')
    expect(result.redis).toBe('r-service')
    expect(result.database).toBe('d-service')
  })
})
