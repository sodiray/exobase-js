export type Model = 'callback' | 'interval' | 'timeout'
export type Id<TModel extends Model = Model> = `cb.${TModel}.${string}`
export type Status = 'active' | 'complete' | 'cleared'

export interface Callback {
  id: Id<'callback'>
  index: number
  attempt: number
  start: number
  end: number
  status: 'error' | 'success'
}

export interface Interval {
  id: Id<'interval'>
  duration: number
  status: Status
  callbacks: Callback[]
  createdAt: number
}

export interface Timeout {
  id: Id<'timeout'>
  duration: number
  status: Status
  callbacks: Callback[]
  createdAt: number
}
