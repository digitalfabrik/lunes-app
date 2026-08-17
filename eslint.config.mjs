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
      // --- Overly strict rules (for now)
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'off',
      // Requires conditions to be actual booleans instead of relying on truthiness
      '@typescript-eslint/strict-boolean-expressions': 'off',
      // Requires every component to have a displayName for React DevTools
      'react/display-name': 'off',

      // --- Unwanted
      // Requires an empty line between class members
      'lines-between-class-members': 'off',
      '@stylistic/lines-between-class-members': 'off',
      // Requires modules with a single export to use a default export
      'import-x/prefer-default-export': 'off',
      // Requires a defaultProps entry for every optional prop
      'react/require-default-props': 'off',
      // Requires every test to contain at least one assertion
      'jest/expect-expect': 'off',
      // Requires anchors to have a valid, navigable href
      'jsx-a11y/anchor-is-valid': 'off',
      // Forbids circular import dependencies between modules
      'import-x/no-cycle': 'off',
      // Forbids importing a named export under the name of the module's default export
      'import-x/no-named-as-default': 'off',
      // Forbids renaming a default import to a name that differs from the exported binding
      'import-x/no-rename-default': 'off',
      // Enforces a consistent choice between index signatures and Record<K, V>
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      // Requires destructuring instead of repeated member access
      '@typescript-eslint/prefer-destructuring': 'off',
      // Forbids reading or writing refs during render
      'react-hooks/refs': 'off',
      // Requires a default case in every switch statement (covered by switch-exhaustiveness-check)
      'default-case': 'off',

      // --- new hooks that we should eventually enable
      // Forbids setting state directly inside an effect
      'react-hooks/set-state-in-effect': 'off',

      // --- Lints with customized settings
      // Requires braces around all control-statement bodies
      curly: ['error', 'all'],
      // Forbids file extensions in import paths, except for .json
      'import-x/extensions': ['error', 'never', { json: 'always' }],
      // Requires function expressions to be named
      'func-names': 'error',
      // Forbids unnamed numeric literals, so they get a named constant instead
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2, 3, 4, 100],
          ignoreArrayIndexes: true,
        },
      ],
      // Requires destructuring when reading object properties into variables
      'prefer-destructuring': ['error', { array: false }],
      // Requires object spread instead of Object.assign
      'prefer-object-spread': 'error',
      // Forbids console statements in production code
      'no-console': 'error',

      // Requires components to be declared as arrow functions
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      // Forbids fragments that wrap nothing meaningful
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
      // Was enforced via plugin:react/recommended before, which airbnb-extended does not extend
      // Requires a key prop on elements rendered in a list
      'react/jsx-key': 'error',
      // Forbids setState in componentDidMount, which triggers a second render
      'react/no-did-mount-set-state': 'error',
      // Flags declared prop types that are never read
      'react/no-unused-prop-types': 'warn',
      // Requires all reactive values to be listed in hook dependency arrays
      'react-hooks/exhaustive-deps': 'error',

      // Forbids constructors that only call super or do nothing
      '@typescript-eslint/no-useless-constructor': 'error',
      // Requires awaiting only actual promises
      '@typescript-eslint/await-thenable': 'error',
      // Discourages @ts-* comments that suppress type errors
      '@typescript-eslint/ban-ts-comment': 'warn',
      // Requires `type` instead of `interface` for object type declarations
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // Requires explicit return and argument types on exported functions
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      // Forbids empty function bodies, except for constructors
      '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
      // Forbids the `any` type
      '@typescript-eslint/no-explicit-any': 'error',
      // Requires promises to be awaited, returned or explicitly ignored
      '@typescript-eslint/no-floating-promises': 'error',
      // Forbids conditions that the types prove are always truthy or always falsy
      '@typescript-eslint/no-unnecessary-condition': 'error',
      // Flags unused variables and arguments, ignoring names prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_(unused)?$',
          varsIgnorePattern: '^_(unused)?$',
          ignoreRestSiblings: true,
        },
      ],
      // Forbids using a variable before it is declared
      '@typescript-eslint/no-use-before-define': 'error',
      // Requires ?? instead of || when only null and undefined should fall back
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      // Requires @ts-expect-error instead of @ts-ignore
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      // Restricts template literal interpolation to strings
      '@typescript-eslint/restrict-template-expressions': 'error',

      // Requires switches over union types to handle every member
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // Requires a consistent choice between test() and it()
      'jest/consistent-test-it': 'error',
      // Forbids matcher aliases such as toBeCalledWith in favour of the full names
      'jest/no-alias-methods': 'error',

      // Requires arrow functions instead of function declarations and expressions
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
      // Requires require() calls to be at the top level
      'global-require': 'off',
      // Forbids console statements
      'no-console': 'off',
      // Forbids unnamed numeric literals
      'no-magic-numbers': 'off',
      // Forbids `const x = require(...)`
      '@typescript-eslint/no-var-requires': 'off',
      // Forbids the non-null assertion operator
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Requires promises to be awaited, returned or explicitly ignored
      '@typescript-eslint/no-floating-promises': 'off',
      // Forbids require() in favour of import
      '@typescript-eslint/no-require-imports': 'off',
      // Forbids importing packages that are not runtime dependencies
      'import-x/no-extraneous-dependencies': 'off',
      // Requires clickable elements to also handle keyboard events
      'jsx-a11y/click-events-have-key-events': 'off',
      // Forbids handlers on non-interactive elements without a role
      'jsx-a11y/no-static-element-interactions': 'off',
      // Forbids spreading props into JSX elements
      'react/jsx-props-no-spreading': 'off',
    },
  },
])
