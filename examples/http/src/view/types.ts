import * as t from '../model/types'

export type CallbackView = {
  _view: 'view.callback'
  index: number
  timestamp: number
  success: boolean
}

export type TimeoutView = {
  _view: 'view.timeout'
  id: string
  duration: number
  status: t.Status
  callbacks: CallbackView[]
  createdAt: number
}
