import { afterEach, describe, expect, jest, test } from '@jest/globals'
import { sleep, tryit } from 'radash'
import { useInitLogger } from '../index'

const original = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
  debug: console.debug.bind(console)
}

describe('useInitLogger hook', () => {
  afterEach(() => {
    console.log = original.log
    console.warn = original.warn
    console.error = original.error
    console.debug = original.debug
  })
  test('calls logger functions during invocation', async () => {
    const logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(() => sleep(1000))
    }
    const sut = useInitLogger({
      logger: () => logger,
      reuseLogger: true,
      awaitFlush: true
    })
    const result = await sut(async () => {
      console.log('hello:log')
      console.warn('hello:warn')
      console.error('hello:error')
      console.debug('hello:debug')
      return 'goodbye'
    })()
    expect(result).toBe('goodbye')
    expect(logger.log).toHaveBeenCalledWith('hello:log')
    expect(logger.warn).toHaveBeenCalledWith('hello:warn')
    expect(logger.error).toHaveBeenCalledWith('hello:error')
    expect(logger.debug).toHaveBeenCalledWith('hello:debug')
  })

  test('rethrows error from given function', async () => {
    const logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(() => sleep(1000))
    }
    const sut = useInitLogger({
      logger,
      passthrough: false,
      reuseLogger: false
    })
    const [err] = await tryit(
      sut(async () => {
        console.log('hello:log')
        console.warn('hello:warn')
        console.error('hello:error')
        console.debug('hello:debug')
        throw 'failure'
      })
    )()
    expect(err).toBe('failure')
    expect(logger.log).toHaveBeenCalledWith('hello:log')
    expect(logger.warn).toHaveBeenCalledWith('hello:warn')
    expect(logger.error).toHaveBeenCalledWith('hello:error')
    expect(logger.debug).toHaveBeenCalledWith('hello:debug')
  })
})
