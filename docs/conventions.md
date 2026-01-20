# Conventions

## Naming

We follow the [airbnb style](https://github.com/airbnb/javascript/tree/master/react) for naming.

## Code style

We use [prettier](https://prettier.io) to format code. Run `yarn prettier --check .` to show formatting problems or `yarn prettier --write .` to fix them.
We use [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) for TypeScript linting. Run `yarn lint` to show linting problems.

### Hints

- Prefer arrow functions
- Use functional components
- Name react hooks `useValue` if they return some value and `useLoadValue` if the return some value asynchronously

## Folder structure

Tests should always be positioned in a `__tests__` directory on the same level as the file which is tested.

```
├── __tests__
│   └── Caption.spec.js
└── Caption.js
```

## Git commit messages and Pull request names

See [this guide](https://github.com/erlang/otp/wiki/Writing-good-commit-messages) for a general reference on how to write
good commit messages.
Commit messages should have the following schema:
**`<Issue key>: Your commit message`**, e.g. `LUN-612: Add commit message documentation`

The same applies for PR names. Branch names should also start with `<Issue key>`-Prefix

## Pull requests

To merge a pull request, it has to match our Definition of Done. It includes among others:

- All checks have to pass
  - [Release notes](https://github.com/digitalfabrik/lunes-app/blob/main/docs/conventions.md#release-notes) have been added for user visible changes
  - Linting: `yarn lint`
  - Typescript: `yarn ts:check`
  - Prettier: `yarn prettier`
  - Unit tests: `yarn test`
- No changes are requested.
- Two approvals are needed.
- New and changed functionality should be tested sufficiently, both manual and by writing unit tests.

**Creating a pull request from a fork prevents checks from the CI. It is a good way to make contact though.**

## Versioning

Versions consist of a version name and a version code.

### Version name

The following [schema](https://calver.org/) ![versioning](https://img.shields.io/badge/calver-YYYY.MM.PATCH-22bfda.svg) is used for versioning.
`PATCH` is a counter for the number of releases in the corresponding month starting with 0.

Examples:

- First versions of 2020: `2020.1.0`, `2020.1.1`, `2020.1.2`.
- First version of February 2020: `2020.2.0`.

### Version code

An additional consecutive version code is used for unique identification in the app stores.
The version code is incremented for every build uploaded to the stores.
The first version code was `100000`.

### Release notes

tbd.
