const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat')
const { FlatCompat } = require('@eslint/eslintrc')
const js = require('@eslint/js')
const { defineConfig, globalIgnores } = require('eslint/config')

const tsParser = require('@typescript-eslint/parser')
const jest = require('eslint-plugin-jest')
const jsxExpressions = require('eslint-plugin-jsx-expressions')
const preferArrow = require('eslint-plugin-prefer-arrow')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = defineConfig([
  globalIgnores([
    '**/reports/',
    '**/dist/',
    '**/lib-dist/',
    '**/patchfiles/',
    'ios/',
    // Flat config lints .cjs by default, which would pull in the vendored yarn bundles
    '.yarn/',
    'eslint.config.js',
    'eslint.config.changed.js',
    'babel.config.js',
    'metro.config.js',
    'metro.config.ci.js',
  ]),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],

    // The plugins used by these configs (react, react-hooks, jsx-a11y, import, jest and
    // @typescript-eslint) are registered by the configs themselves, so they must not be
    // redefined in `plugins` below.
    extends: fixupConfigRules(
      compat.extends(
        'airbnb',
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
        'plugin:jest/recommended',
        'plugin:jest/style',
      ),
    ),

    // Both plugins still rely on the eslintrc-era rule API (e.g. `context.parserServices`),
    // which ESLint 9 removed, so they have to be wrapped by the compat helper.
    plugins: {
      'jsx-expressions': fixupPluginRules(jsxExpressions),
      'prefer-arrow': fixupPluginRules(preferArrow),
    },

    languageOptions: {
      parser: tsParser,
      globals: {
        ...jest.environments.globals.globals,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      // Overly strict rules (for now)
      'no-shadow': 'off',
      'react/display-name': 'off',

      // Unwanted
      'lines-between-class-members': 'off',
      'import/prefer-default-export': 'off',
      'react/require-default-props': 'off',
      'jest/expect-expect': 'off',
      'jsx-a11y/anchor-is-valid': 'off',

      // Disabling since better @typescript-eslint rules available or they make no sense for ts projects
      'default-case': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',
      'import/no-unresolved': 'off',
      'react/jsx-filename-extension': 'off',

      curly: ['error', 'all'],
      'import/extensions': ['error', 'never', { json: 'always' }],
      'func-names': 'error',
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2, 3, 4, 100],
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

      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
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
  },
  {
    files: [
      '**/*.spec.{ts,tsx}',
      '**/__mocks__/*.{ts,tsx}',
      '**/testing/*.{ts,tsx}',
      'jest.setup.ts',
      'jest.config.ts',
    ],

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
])
