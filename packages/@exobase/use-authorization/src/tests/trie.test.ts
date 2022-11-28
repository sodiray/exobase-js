import { describe, expect, test } from '@jest/globals'
import { build, search, Trie } from '../trie'
import type { Permission } from '../types'

// allow::us.praxisco/company/px.company.gb123/training/px.training.2022123::edit

const permissions = {
  training: {
    edit: {
      name: 'Edit training 2022123',
      uri: 'us.praxisco/company/px.company.gb123/training/px.training.2022123',
      acl: 'allow',
      scope: 'edit'
    } as Permission,
    read: {
      name: 'Read all companies in all trainings',
      uri: 'us.praxisco/company/*/training/*',
      acl: 'allow',
      scope: 'read'
    } as Permission
  },
  event: {
    any: {
      name: 'Do anything to any event in company gb123',
      uri: 'us.praxisco/company/px.company.gb123/training/*/event/*',
      acl: 'allow',
      scope: '*'
    } as Permission
  },
  company: {
    edit: {
      name: 'Not allowed to update any company',
      uri: 'us.praxisco/company/*',
      acl: 'deny',
      scope: 'edit'
    } as Permission
  }
}

describe('ptree', () => {
  test('builds trie correctly', () => {
    const result = build([
      permissions.training.edit,
      permissions.training.read,
      permissions.event.any,
      permissions.company.edit
    ])
    const expected: Trie = {
      value: [],
      children: {
        'us.praxisco': {
          value: [],
          children: {
            company: {
              value: [],
              children: {
                '*': {
                  value: [permissions.company.edit],
                  children: {
                    training: {
                      value: [],
                      children: {
                        '*': {
                          value: [permissions.training.read],
                          children: {}
                        }
                      }
                    }
                  }
                },
                'px.company.gb123': {
                  value: [],
                  children: {
                    training: {
                      value: [],
                      children: {
                        '*': {
                          value: [],
                          children: {
                            event: {
                              value: [],
                              children: {
                                '*': {
                                  value: [permissions.event.any],
                                  children: {}
                                }
                              }
                            }
                          }
                        },
                        'px.training.2022123': {
                          value: [permissions.training.edit],
                          children: {}
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    expect(result).toEqual(expected)
  })
  test('searches trie correctly', () => {
    const ptree = build([
      permissions.training.edit,
      permissions.training.read,
      permissions.event.any,
      permissions.company.edit
    ])
    const result = search(ptree, permissions.company.edit)
    expect(result.length).toBe(1)
    expect(result[0]).toEqual(permissions.company.edit)
  })
})
