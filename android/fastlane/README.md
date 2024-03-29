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
### android keystore
```
fastlane android keystore
```
Download and decrypt the JKS
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
### android upload_to_browserstack
```
fastlane android upload_to_browserstack
```
Upload Android App to BrowserStack
### android upload_to_playstore
```
fastlane android upload_to_playstore
```
Upload Android App to Google Play
### android playstore_promote
```
fastlane android playstore_promote
```
Promote the most recent version in the beta track to the production track in the Play Store.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
