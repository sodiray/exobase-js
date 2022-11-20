import * as t from '../types'

// In memory data object
const db: {
  intervals: Record<string, t.Interval>
  timeouts: Record<string, t.Timeout>
} = {
  intervals: {},
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
        if (timeout) {
          db.timeouts[id] = {
            ...timeout,
            ...patch
          }
        }
      }
    },
    intervals: {
      find: async (id: t.Id<'interval'>): Promise<t.Interval | null> => {
        return db.intervals[id] ?? null
      },
      list: async (): Promise<t.Interval[]> => {
        return Object.values(db.intervals).filter(x => x.status === 'active')
      },
      create: async (interval: t.Interval): Promise<void> => {
        db.intervals[interval.id] = interval
      },
      patch: async (
        id: t.Id<'interval'>,
        patch: Partial<Pick<t.Interval, 'duration' | 'status'>>
      ) => {
        const interval = db.intervals[id]
        if (interval) {
          db.intervals[id] = {
            ...interval,
            ...patch
          }
        }
      }
    }
  }
}

export type Database = ReturnType<typeof databaseClient>
