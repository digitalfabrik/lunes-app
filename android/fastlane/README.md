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
## Android
### android validate_play_store_key
```
fastlane android validate_play_store_key
```
Validate Play Store Key
### android build
```
fastlane android build
```
Build Android App
### android test_apk
```
fastlane android test_apk
```
Test APK to be removed
### android upload_to_browserstack
```
fastlane android upload_to_browserstack
```
Upload Android App to BrowserStack

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
