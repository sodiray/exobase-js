import * as t from '../types'

export const CallbackView = {
  from: (model: t.Callback): t.CallbackView => ({
    _view: 'view.callback',
    index: model.index,
    success: model.success,
    timestamp: model.timestamp
  })
}

export const TimeoutView = {
  from: (model: t.Timeout): t.TimeoutView => ({
    _view: 'view.timeout',
    id: model.id,
    duration: model.duration,
    status: model.status,
    callbacks: model.callbacks.map(CallbackView.from),
    createdAt: model.createdAt
  })
}

