const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    // 'plugin:markdown/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  settings: {
    'import/resolver': {
      node: { extensions: ['.js', '.mjs', '.ts', '.d.ts', '.tsx'] }
    }
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'no-undef': 'off'
      }
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/no-duplicates': 'off'
      }
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    },
    {
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser'
    },
    {
      files: ['**/*.md/*.js', '**/*.md/*.ts'],
      rules: {
        'no-console': 'off',
        'import/no-unresolved': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  rules: {
    'prettier/prettier': 'off',
    'no-debugger': 'warn',

    // ts
    '@typescript-eslint/no-unused-vars': 'off', // 未使用变量警告
    'typescript-eslint/@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off', //允许使用any
    '@typescript-eslint/no-this-alias': [
      'error',
      {
        allowedNames: ['that'] // this可用的局部变量名称
      }
    ],
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: true,
        types: {
          '{}': false
        }
      }
    ],
    '@typescript-eslint/ban-ts-comment': 'off', //允许使用@ts-ignore
    '@typescript-eslint/no-non-null-assertion': 'off' //允许使用非空断言
  }
});
