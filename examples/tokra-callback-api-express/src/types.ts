export * from './model/types'
export * from './view/types'

export type Endpoint = {
  handler: () => {}
  config: {
    method: 'GET' | 'POST' | 'PUT'
    path: string
  }
}
