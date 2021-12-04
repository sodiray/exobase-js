// IMPORT
import { create as createToken } from './token'
import { create as createPermission } from './permission'

import { useBasicAuthentication } from './basic'
import { useTokenAuthentication } from './bearer'
import { useApiKeyAuthentication } from './key'

// EXPORT
export type { Token } from './token'
export type { Permission } from './permission'
export { create as createToken } from './token'
export { create as createPermission } from './permission'
export { useBasicAuthentication } from './basic'
export { useTokenAuthentication } from './bearer'
export { useApiKeyAuthentication } from './key'

export default {
  createToken,
  createPermission,
  useBasicAuthentication,
  useTokenAuthentication,
  useApiKeyAuthentication
}