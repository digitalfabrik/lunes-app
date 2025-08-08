fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios build

```sh
[bundle exec] fastlane ios build
```

Create a release build

### ios upload_to_appstoreconnect

```sh
[bundle exec] fastlane ios upload_to_appstoreconnect
```

Deliver the app to App Store Connect. The app is submitted for review and released automatically.

### ios upload_to_test_flight

```sh
[bundle exec] fastlane ios upload_to_test_flight
```

Deliver iOS App to TestFlight for testers

### ios appstoreconnect_promote

```sh
[bundle exec] fastlane ios appstoreconnect_promote
```

Promote the app from testflight to production in App Store Connect.

### ios prepare_metadata

```sh
[bundle exec] fastlane ios prepare_metadata
```

Prepare metadata

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
