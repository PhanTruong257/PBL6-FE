//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'sort-imports': 'off',
      'import/order': 'off',
      'import/consistent-type-specifier-style': 'off',
      '@typescript-eslint/array-type': 'off',
    }
  }
]
