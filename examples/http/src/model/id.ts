import { v4 as uuid } from 'uuid'
import type { Id, Model } from './types'

export const id = <TModel extends Model>(model: TModel): Id<TModel> => {
  return `cb.${model}.${uuid().replace(/\-/g, '')}`
}
