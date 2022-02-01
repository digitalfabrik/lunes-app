module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'prefer-arrow'],
  extends: [
    '@react-native-community',
    'standard-with-typescript',
    // 'airbnb',
    // 'airbnb/hooks',
    // 'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style'
  ],
  env: {
    es6: true,
    'jest/globals': true
  },
  ignorePatterns: ['**/reports/', '**/node_modules/', '**/ios/', '**/dist/', '**/lib-dist/'],
  rules: {
    // Overly strict rules (for now)
    'class-methods-use-this': 'off',
    'global-require': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'lines-between-class-members': 'off',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'react/display-name': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',

    // Disabling since better @typescript-eslint rules available
    'default-case': 'off',
    'no-use-before-define': 'off',

    curly: ['error', 'all'],
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 3, 4],
        ignoreArrayIndexes: true
      }
    ],
    'prefer-destructuring': ['error', { array: false }],
    'prefer-object-spread': 'error',

    'react/no-did-mount-set-state': 'error',
    'react/no-unused-prop-types': 'warn',

    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_(unused)?',
        varsIgnorePattern: '_(unused)?',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    'jest/consistent-test-it': 'error',

    'prefer-arrow/prefer-arrow-functions': 'error',

    // TODO check
    'react/prefer-es6-class': ['error', 'always'],
    'react/prop-types': 'off',

    // TODO check
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error'
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  overrides: [
    {
      files: ['*.spec.{ts,tsx}', '**/__mocks__/*.ts'],
      rules: {
        'no-console': 'off',
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off'
      }
    }
  ]
}
