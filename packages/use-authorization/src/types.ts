export type Permission = {
  acl: 'allow' | 'deny'
  scope: string
  uri: string
  name: string | null
}

export type PermissionKey =
  `${Permission['acl']}::${Permission['scope']}::${Permission['uri']}`
