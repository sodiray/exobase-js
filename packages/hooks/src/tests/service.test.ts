import chai from 'chai'

import { withServices } from '../service'

const { assert } = chai

test('withServices passess all services', async () => {
    const services = {
        octokit: 'o-service',
        redis: 'r-service'
    }
    const mockFunc = ({ services }) => services
    const result = await withServices(mockFunc, services, { services: {} } as any)
    assert.equal(result.octokit, 'o-service')
    assert.equal(result.redis, 'r-service')
})

test('withServices passess existing services', async () => {
    const services = {
        octokit: 'o-service',
        redis: 'r-service'
    }
    const existingServices = {
        database: 'd-service'
    }
    const mockFunc = ({ services }) => services
    const result = await withServices(mockFunc, services, { services: existingServices } as any)
    assert.equal(result.octokit, 'o-service')
    assert.equal(result.redis, 'r-service')
    assert.equal(result.database, 'd-service')
})
