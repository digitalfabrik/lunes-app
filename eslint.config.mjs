import js from '@eslint/js'
import { configs, plugins } from 'eslint-config-airbnb-extended'
import { rules as prettierConfigRules } from 'eslint-config-prettier'
import jest from 'eslint-plugin-jest'
import preferArrow from 'eslint-plugin-prefer-arrow'
import { defineConfig } from 'eslint/config'

const jsConfig = defineConfig([
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,
])

const reactConfig = defineConfig([plugins.react, plugins.reactHooks, plugins.reactA11y, ...configs.react.recommended])

const typescriptConfig = defineConfig([
  plugins.typescriptEslint,
  ...configs.base.typescript,
  ...configs.react.typescript,
])

const jestConfig = defineConfig([jest.configs['flat/recommended'], jest.configs['flat/style']])

const prettierConfig = defineConfig([
  {
    name: 'prettier/config',
    rules: prettierConfigRules,
  },
])

export default defineConfig([
  ...jsConfig,
  ...reactConfig,
  ...typescriptConfig,
  ...jestConfig,
  ...prettierConfig,
  {
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },

    plugins: {
      'prefer-arrow': preferArrow,
    },

    rules: {
      // Overly strict rules (for now)
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'react/display-name': 'off',

      // Unwanted
      'lines-between-class-members': 'off',
      '@stylistic/lines-between-class-members': 'off',
      'import-x/prefer-default-export': 'off',
      'react/require-default-props': 'off',
      'jest/expect-expect': 'off',
      'jsx-a11y/anchor-is-valid': 'off',

      // Newly introduced by airbnb-extended, switched off in integreat-app as well
      'import-x/no-cycle': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-rename-default': 'off',
      'import-x/no-useless-path-segments': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',

      // React Compiler rules added by eslint-plugin-react-hooks v7. Only rules-of-hooks and
      // exhaustive-deps were enforced before, so these are switched off to be enabled separately.
      'react-hooks/component-hook-factories': 'off',
      'react-hooks/config': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/use-memo': 'off',

      // Disabling since better @typescript-eslint rules available or they make no sense for ts projects
      'default-case': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      'no-empty-function': 'off',
      'import-x/no-unresolved': 'off',
      'react/jsx-filename-extension': 'off',

      curly: ['error', 'all'],
      'import-x/extensions': ['error', 'never', { json: 'always' }],
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
      // Was enforced via plugin:react/recommended before, which airbnb-extended does not extend
      'react/jsx-key': 'error',
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
          argsIgnorePattern: '^_(unused)?$',
          varsIgnorePattern: '^_(unused)?$',
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
    },

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    settings: {
      react: {
        version: '19.2.3',
      },
    },
  },

  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      parserOptions: {
        // New typescript-eslint mode: uses a shared project service instead of per-file program creation.
        projectService: true,
      },
    },
  },

  {
    ignores: [
      '**/reports/',
      '**/ios/',
      '**/android/',
      '**/dist/',
      '**/lib-dist/',
      '**/patchfiles/',
      '.yarn/',
      'eslint.config.mjs',
      'eslint.config.changed.mjs',
      '**/*.js',
    ],
  },

  // rules that can be relaxed for testing
  {
    files: [
      '**/*.spec.{ts,tsx}',
      '**/__mocks__/*.{ts,tsx}',
      '**/testing/*.{ts,tsx}',
      '**/jest.setup.ts',
      '**/jest.config.ts',
    ],

    rules: {
      'global-require': 'off',
      'no-console': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'import-x/no-extraneous-dependencies': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'react/jsx-props-no-spreading': 'off',
    },
  },
])
