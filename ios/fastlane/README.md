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
### ios upload_to_test_flight
```
fastlane ios upload_to_test_flight
```
Deliver iOS App to TestFlight for testers

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
