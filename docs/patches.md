# Patches

Sometimes libraries have issues that were not fixed by the community yet.
Therefore here is a short description how to patch a 3rd party package.

## Manual

- `yarn install <package name>` Install the package you want to fix. Ensure that you didn't change anything yet
- apply the changes in the `node_modules/<package name>` files.
- `yarn android` or retrigger build in Xcode to test your changes
- `npx patch-package <package name>` (patch-package is required as dev depencency)
- commit the created patch file
- lock the package in `package.json` because the patch may not apply correctly on different package versions
