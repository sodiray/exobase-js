---
title: 'core'
description: 'A kitchen sync package with all Exobase hooks'
group: 'Packages'
---

For those who don't want to install all the `@exobase/use-*` hook packages individually this packages is a shortcut to install all the hooks at once.

_Note: does not include root hooks_

## Usage

```ts
import {
  useApiKey,
  useBasicAuth,
  useCors,
  useTokenAuth,
  usePathParams,
  useRoute,
  useServices,
  useHeaders,
  useJsonBody,
  useQueryString
} from '@exobase/hooks'
```
