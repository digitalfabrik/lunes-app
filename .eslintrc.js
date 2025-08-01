module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest', 'jsx-expressions', 'prefer-arrow', 'react', 'react-hooks'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  env: {
    es6: true,
    'jest/globals': true,
  },
  ignorePatterns: [
    '**/reports/',
    '**/node_modules/',
    '**/ios/',
    '**/dist/',
    '**/lib-dist/',
    '**/patchfiles/',
    '.eslintrc.js',
    'babel.config.js',
    'metro.config.js',
  ],
  rules: {
    // Overly strict rules (for now)
    'no-shadow': 'off',
    'react/display-name': 'off',

    // Unwanted
    'lines-between-class-members': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'react/require-default-props': 'off',
    'jest/expect-expect': 'off',
    'jsx-a11y/anchor-is-valid': 'off',

    // Disabling since better @typescript-eslint rules available or they make no sense for ts projects
    'default-case': 'off',
    'no-use-before-define': 'off',
    'import/no-unresolved': 'off',
    'react/jsx-filename-extension': 'off',

    curly: ['error', 'all'],
    'func-names': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 3, 4],
        ignoreArrayIndexes: true,
      },
    ],
    'prefer-destructuring': ['error', { array: false }],
    'prefer-object-spread': 'error',
    'no-console': 'error',

    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'react/no-did-mount-set-state': 'error',
    'react/no-unused-prop-types': 'warn',
    'react-hooks/exhaustive-deps': 'error',

    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '_(unused)?',
        varsIgnorePattern: '_(unused)?',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-ts-expect-error': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    'jest/consistent-test-it': 'error',
    'jest/no-alias-methods': 'error',

    'prefer-arrow/prefer-arrow-functions': 'error',

    'jsx-expressions/strict-logical-expressions': 'error',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['*.spec.{ts,tsx}', '**/__mocks__/*.{ts,tsx}', '**/testing/*.{ts,tsx}', 'jest.setup.ts', 'jest.config.ts'],
      rules: {
        'global-require': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'import/no-extraneous-dependencies': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'react/jsx-props-no-spreading': 'off',
      },
    },
  ],
}
