import { expect, test } from '@jest/globals'
import { withServices } from '../index'

test('withServices passess all services', async () => {
  const services = {
    octokit: () => 'o-service',
    redis: () => 'r-service'
  }
  const mockFunc = (props: any) => props.services
  const result = await withServices(mockFunc, services, { services: {} } as any)
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
  const mockFunc = (props: any) => props.services
  const result = await withServices(mockFunc, services, {
    services: existingServices
  } as any)
  expect(result.octokit).toBe('o-service')
  expect(result.redis).toBe('r-service')
  expect(result.database).toBe('d-service')
})
