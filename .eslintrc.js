module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: `./tsconfig.json`
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest'],
  extends: ['standard-with-typescript', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  env: {
    es6: true,
    'jest/globals': true
  },
  ignorePatterns: ['**/reports/', '**/node_modules/', '**/ios/main.jsbundle', '**/dist/', '**/lib-dist/'],
  rules: {
    'arrow-parens': ['error', 'as-needed'],
    curly: ['error', 'all'],
    'no-loop-func': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    'prefer-template': 'error',

    'react/display-name': 'off',
    'react/no-access-state-in-setstate': 'error',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-unescaped-entities': 'off',
    'react/no-unused-prop-types': 'warn',
    'react/no-typos': 'error',
    'react/prefer-es6-class': ['error', 'always'],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // TODO LUN-55: Use errors again for these typescript rules
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/restrict-template-expressions': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'warn',

    'jest/consistent-test-it': 'error',
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/no-test-prefixes': 'error',
    'jest/prefer-to-be-null': 'error',
    'jest/prefer-to-have-length': 'error',
    'jest/valid-describe': 'error',
    'jest/valid-expect': 'error'
  },
  overrides: [
    {
      files: ['*.js'],
      excludedFiles: ['*.spec.js', '**/__mocks__/*.js'],
      rules: {
        'no-magic-numbers': [
          'error',
          {
            ignore: [-1, 0, 1, 2],
            ignoreArrayIndexes: true
          }
        ]
      }
    }
  ]
}
