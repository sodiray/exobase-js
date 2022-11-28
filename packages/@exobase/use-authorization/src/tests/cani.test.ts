import { describe, expect, test } from '@jest/globals'
import { user } from '../cani'
import { cani } from '../index'
import type { PermissionKey } from '../types'

describe('cani module', () => {
  const required: PermissionKey =
    'allow::edit::us.praxisco/company/px.company.gb123/training/px.training.2022123'
  describe('cani function', () => {
    test('returns true when given permission is exact match', () => {
      expect(
        cani({
          do: required,
          with: 'allow::edit::us.praxisco/company/px.company.gb123/training/px.training.2022123'
        })
      ).toBe(true)
    })
    test('returns false when given permission has incorrect scope', () => {
      expect(
        cani({
          do: required,
          with: 'allow::read::us.praxisco/company/px.company.gb123/training/px.training.2022123'
        })
      ).toBe(false)
    })
    test('returns false when given permissions are unrelated to the entity', () => {
      expect(
        cani({
          do: required,
          with: [
            'allow::*::us.praxisco/company/px.company.gb123/training/px.training.2022123/event/px.event.1203',
            'allow::*::us.praxisco/company/px.company.gb123'
          ]
        })
      ).toBe(false)
    })
    test('returns false when the permission is held but a deny permission overrides it', () => {
      expect(
        cani({
          do: required,
          with: [
            'allow::read::us.praxisco/company/*/training/*',
            'allow::edit::us.praxisco/company/*/training/*',
            'deny::edit::us.praxisco/company/px.company.gb123/training/px.training.2022123'
          ]
        })
      ).toBe(false)
    })
  })

  describe('cani user function wrapper', () => {
    test('returns true when user has permission', () => {
      const u = user(['allow::*::com.github/rayepps/exobase-js/settings'])
      const result = u.do('allow::read::com.github/rayepps/exobase-js/settings')
      expect(result).toBe(true)
    })
    test('returns false when user does not have permission', () => {
      const u = user(['allow::read::com.github/rayepps/exobase-js/settings'])
      const result = u.do('allow::edit::com.github/rayepps/exobase-js/settings')
      expect(result).toBe(false)
    })
  })
})
