
export type Permission = {
  entity: string
  action: string
  key: string
  description: string
}

// Permission Key = {entity}::{action}
export const create = (entity: string, action: string, description: string): Permission => ({
  entity, 
  action, 
  key: `${entity}::${action}`,
  description
})