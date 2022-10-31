import * as yup from 'yup'

export type Yup = typeof yup
export type KeyOfType<T, Value> = { [P in keyof T]: Value }
