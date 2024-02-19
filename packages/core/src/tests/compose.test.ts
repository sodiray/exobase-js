import { describe, expect, test } from '@jest/globals'
import { compose } from '../compose'
import { props } from '../props'
import { Props, Request } from '../types'

const useMockRootHook =
  () =>
  <R>(
    func: (
      props: Props<{}, {}, {}, Request, { name: 'next'; startedAt: 100 }>
    ) => Promise<R>
  ) => {
    const handler = async (): Promise<R> => {
      return await func({
        ...props({} as unknown as Request),
        framework: {
          name: 'next',
          startedAt: 100
        }
      })
    }
    handler.root = 'next'
    return handler
  }

const func = useMockRootHook()
const result = func(() => ({} as any))

const useMockServicesHook =
  <TServices extends {}>(services: TServices) =>
  <R>(func: (props: Props<{}, TServices>) => Promise<R>) => {
    const handler = async (props: Props): Promise<R> => {
      return await func({
        ...props,
        services: {
          ...props.services,
          ...services
        }
      })
    }
    handler.services = Object.keys(services)
    return handler
  }

const useMockArgsHook =
  <TArgs extends {}>(args: TArgs) =>
  <R>(func: (props: Props<TArgs>) => Promise<R>) => {
    const handler = async (props: Props): Promise<R> => {
      return await func({
        ...props,
        args: {
          ...props.args,
          ...args
        }
      })
    }
    handler.args = Object.keys(args)
    return handler
  }

const useMockAuthHook =
  <TAuth extends {}>(auth: TAuth) =>
  <R>(func: (props: Props<{}, {}, TAuth>) => Promise<R>) => {
    const handler = async (props: Props): Promise<R> => {
      return await func({
        ...props,
        auth: {
          ...props.auth,
          ...auth
        }
      })
    }
    handler.auth = Object.keys(auth)
    return handler
  }

/**
 * Tehse tests set up composed files to ensure that the
 * types work for all the overloads of our compose
 * function.
 *
 * The idea is: If the types are changed in the compose
 * file in a way that breaks any usage of the function
 * this file will fail build/test.
 *
 * Each test should ensure that...
 * 1. The compose function passes the proper types of all
 *    given hooks and infers the correct Props type for
 *    the final endpoint function
 * 2. The composed function's arguments type match the
 *    argument type of the root hook
 */
describe('compose function types', () => {
  test('it supports 0 hooks', async () => {
    const func = compose(useMockRootHook(), async props => {
      expect(props.framework.name).toBe('next')
      return 'success'
    })
    const result = await func()
    expect()
    expect(result).toBe('success')
  })
  test('it supports 1 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 2 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 3 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => null } }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBeNull()
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 4 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => null } }),
      useMockArgsHook({ query: 'alto' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBeNull()
        expect(props.args.query).toBe('alto')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 5 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => null } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBeNull()
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 6 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 7 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      useMockArgsHook({ name: 'ray' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        expect(props.args.name).toBe('ray')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 8 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      useMockArgsHook({ name: 'ray' }),
      useMockAuthHook({ provider: 'google' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        expect(props.args.name).toBe('ray')
        expect(props.auth.provider).toBe('google')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 9 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      useMockArgsHook({ name: 'ray' }),
      useMockAuthHook({ provider: 'google' }),
      useMockServicesHook({ temporal: { users: () => 21 } }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        expect(props.args.name).toBe('ray')
        expect(props.auth.provider).toBe('google')
        expect(props.services.temporal.users()).toBe(21)
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 10 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      useMockArgsHook({ name: 'ray' }),
      useMockAuthHook({ provider: 'google' }),
      useMockServicesHook({ temporal: { users: () => 21 } }),
      useMockArgsHook({ location: 'arc/tn' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        expect(props.args.name).toBe('ray')
        expect(props.auth.provider).toBe('google')
        expect(props.services.temporal.users()).toBe(21)
        expect(props.args.location).toBe('arc/tn')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 11 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      useMockArgsHook({ name: 'ray' }),
      useMockAuthHook({ provider: 'google' }),
      useMockServicesHook({ temporal: { users: () => 21 } }),
      useMockArgsHook({ location: 'arc/tn' }),
      useMockAuthHook({ strategy: 'jwt' }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        expect(props.args.name).toBe('ray')
        expect(props.auth.provider).toBe('google')
        expect(props.services.temporal.users()).toBe(21)
        expect(props.args.location).toBe('arc/tn')
        expect(props.auth.strategy).toBe('jwt')
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
  test('it supports 12 hooks', async () => {
    const result = await compose(
      useMockRootHook(),
      useMockArgsHook({ id: 'first' }),
      useMockAuthHook({ token: 'secret' }),
      useMockServicesHook({ db: { users: () => 3 } }),
      useMockArgsHook({ query: 'alto' }),
      useMockAuthHook({ secret: 'shh' }),
      useMockServicesHook({ redis: { users: () => 9 } }),
      useMockArgsHook({ name: 'ray' }),
      useMockAuthHook({ provider: 'google' }),
      useMockServicesHook({ temporal: { users: () => 21 } }),
      useMockArgsHook({ location: 'arc/tn' }),
      useMockAuthHook({ strategy: 'jwt' }),
      useMockServicesHook({ s3: { users: () => 32 } }),
      async props => {
        expect(props.framework.name).toBe('next')
        expect(props.args.id).toBe('first')
        expect(props.auth.token).toBe('secret')
        expect(props.services.db.users()).toBe(3)
        expect(props.args.query).toBe('alto')
        expect(props.auth.secret).toBe('shh')
        expect(props.services.redis.users()).toBe(9)
        expect(props.args.name).toBe('ray')
        expect(props.auth.provider).toBe('google')
        expect(props.services.temporal.users()).toBe(21)
        expect(props.args.location).toBe('arc/tn')
        expect(props.auth.strategy).toBe('jwt')
        expect(props.services.s3.users()).toBe(32)
        return 'success'
      }
    )()
    expect(result).toBe('success')
  })
})

describe('compose function property aggregation', () => {
  test('aggregates properties from all hooks', async () => {
    const composed = compose(
      useMockRootHook(),
      useMockArgsHook({ id: 1 }),
      useMockServicesHook({ db: 1 }),
      useMockAuthHook({ token: 1 }),
      async () => 'success'
    ) as any
    expect(await composed()).toBe('success')
    expect(composed.root).toBe('next')
    expect(composed.args).toEqual(['id'])
    expect(composed.services).toEqual(['db'])
    expect(composed.auth).toEqual(['token'])
  })
})
