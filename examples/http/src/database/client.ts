import * as t from '../types'

// In memory data object
const db: {
  timeouts: Record<string, t.Timeout>
} = {
  timeouts: {}
}

export const databaseClient = () => {
  return {
    timeouts: {
      find: async (id: t.Id<'timeout'>): Promise<t.Timeout | null> => {
        return db.timeouts[id] ?? null
      },
      list: async (): Promise<t.Timeout[]> => {
        return Object.values(db.timeouts).filter(x => x.status === 'active')
      },
      create: async (timeout: t.Timeout): Promise<void> => {
        db.timeouts[timeout.id] = timeout
      },
      patch: async (
        id: t.Id<'timeout'>,
        patch: Partial<Pick<t.Timeout, 'duration' | 'status'>>
      ) => {
        const timeout = db.timeouts[id]
        if (!timeout) {
          throw new Error('not found')
        }
        const newTimeout: t.Timeout = {
          ...timeout,
          ...patch
        }
        db.timeouts[id] = newTimeout
        return newTimeout
      },
      addCallback: async (id: t.Timeout['id'], callback: t.Callback) => {
        const timeout = db.timeouts[id]
        if (!timeout) {
          throw new Error('not found')
        }
        const newTimeout: t.Timeout = {
          ...timeout,
          callbacks: [...timeout.callbacks, callback]
        }
        db.timeouts[id] = newTimeout
        return newTimeout
      }
    }
  }
}

export type Database = ReturnType<typeof databaseClient>
