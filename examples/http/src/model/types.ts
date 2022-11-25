export type Model = 'timeout'
export type Id<TModel extends Model = Model> = `cb.${TModel}.${string}`
export type Status = 'active' | 'complete' | 'cleared'

export interface Callback {
  index: number
  success: boolean
  timestamp: number
}

export interface Timeout {
  id: Id<'timeout'>
  duration: number
  url: string
  status: Status
  callbacks: Callback[]
  createdAt: number
}
