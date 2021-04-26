# Continuous Integration and Delivery

## Content

- [Workflows](#workflows)
- [Fastlane](#fastlane)

## Workflows

Several workflows exist for different purposes:

- **commit**: Executed for all commits of PRs to ensure good code quality and working code.

## Fastlane

Fastlane is a task-runner for triggering build relevant tasks. It offers integration with XCode and the Android SDK for building and delivering the app.

### Fastlane Setup

- Make sure ruby is installed and `ruby --version` reports the correct version
- run `bundle config set --local path 'vendor/bundle` to set the local path
- run `bundle install` in the project root **AND** in `./android/` **AND** in `./ios/`.

### Lanes

To run a lane run `bundle exec fastlane [lane]`

Lanes for Android live in [./android/fastlane](./android/fastlane) and for iOS in [./ios/fastlane](./ios/fastlane)

## Environment Variables and Dependencies

| Variable                | Description                 | Where do I get it from? | Example  | Reference                                                             |
| ----------------------- | --------------------------- | ----------------------- | -------- | --------------------------------------------------------------------- |
| BROWSERSTACK_ACCESS_KEY | Access Key for BrowserStack | Password Manager        | DEADBEEF | [Appium REST API](https://www.browserstack.com/app-automate/rest-api) |
| BROWSERSTACK_USERNAME   | Username for BrowserStack   | Password Manager        | 123546   | [Appium REST API](https://www.browserstack.com/app-automate/rest-api) |

### Android Variables

| Variable                    | Description                                                                                                | Where do I get it from? | Example | Reference                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------- | ------- | ------------------------------------------------------------------------------------------------------ |
| GOOGLE_SERVICE_ACCOUNT_JSON | JSON for authentication in the Google Play Console as Release Manager. This should expire after two years. | Password Manager        | {...}   | [Service Account Docu](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=de) |
