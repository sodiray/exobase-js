import * as t from '../types'

export const CallbackView = {
  from: (model: t.Callback): t.CallbackView => ({
    _view: 'view.callback',
    id: model.id,
    status: model.status,
    start: model.start,
    end: model.end,
    attempt: model.attempt,
    index: model.index
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

export const IntervalView = {
  from: (model: t.Interval): t.IntervalView => ({
    _view: 'view.interval',
    id: model.id,
    duration: model.duration,
    status: model.status,
    callbacks: model.callbacks.map(CallbackView.from),
    createdAt: model.createdAt
  })
}
