import * as t from '../model/types'

export type CallbackView = {
  _view: 'view.callback'
  id: string
  index: number
  attempt: number
  start: number
  end: number
  status: 'error' | 'success'
}

export type IntervalView = {
  _view: 'view.interval'
  id: string
  duration: number
  status: t.Status
  callbacks: CallbackView[]
  createdAt: number
}

export type TimeoutView = {
  _view: 'view.timeout'
  id: string
  duration: number
  status: t.Status
  callbacks: CallbackView[]
  createdAt: number
}
