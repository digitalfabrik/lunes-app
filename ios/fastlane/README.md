fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios build
```
fastlane ios build
```
Create a release build
### ios upload_to_browserstack
```
fastlane ios upload_to_browserstack
```
Upload iOS App to BrowserStack
### ios upload_to_appstoreconnect
```
fastlane ios upload_to_appstoreconnect
```
Deliver the app to App Store Connect. The app is submitted for review and released automatically.
### ios upload_to_test_flight
```
fastlane ios upload_to_test_flight
```
Deliver iOS App to TestFlight for testers
### ios appstoreconnect_promote
```
fastlane ios appstoreconnect_promote
```
Promote the app from testflight to production in App Store Connect.
### ios prepare_release_notes
```
fastlane ios prepare_release_notes
```
Prepare release notes

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
