# Continuous Integration and Delivery

## Content

- [Deliver a new release by triggering the CI](#triggering-a-delivery-using-the-ci)
- [Workflows](#workflows)
- [Services](#services)
- [Fastlane](#fastlane)

## Triggering a Delivery using the CI

The easiest way to deliver a new build to production or development is to trigger the corresponding CircleCI workflows _triggered_native_development_delivery_ and _triggered_production_delivery_:

- Get a CircleCI [Personal API Token](https://circleci.com/docs/2.0/managing-api-tokens/).
- Trigger a delivery by sending a POST request to:`https://circleci.com/api/v2/project/github/digitalfabrik/lunes-app/pipeline`
  - header needs to contain `Circle-Token=your-personal-token` and `content-type=application/json`
  - body could look like this:
    ```json
    {
      "parameters": {
        "run_commit": false,
        "run_dev_delivery": true
      }
    }
    ```
  - If no branch is specified, main is used as default. This should normally not be changed.
  - Per default a development delivery is made.
  - For more information on how to use it, execute it without parameters to see usage information.

## Workflows

Several workflows exist for different purposes:

- **commit**: Executed for all commits of PRs to ensure good code quality and working code.
- **dev_delivery**: [Manually triggerable](#triggering-a-delivery-using-the-ci) workflow which delivers builds to development (currently only android).
- **prod_delivery**: [Manually triggerable](#triggering-a-delivery-using-the-ci) workflow which delivers builds to development (not available yet).

## Services

### deliverino (GitHub)

`deliverino` is a GitHub App and can be accessed and installed [here](https://github.com/apps/deliverino). This bot bumps the version of the app when a new release is delivered.
A private key in PEM format grants access to the bot. If the `deliverino` is installed for a specific repository then it has access to create commits there.

**`deliverino` has the role of an Administrator. This is important when setting up [Protected branches](https://help.github.com/en/github/administering-a-repository/about-branch-restrictions) in GitHub. You have to disable "Include Administrators", else `deliverino` is not allowed to directly commit to the protected branch.**

### Google Play Store

You can visit the management website for the Play Store [here](https://play.google.com/apps/publish/). The Google Play Console is the product by Google for managing the App Store presence.

#### Adding Testers to the Beta Track

The Play Store has the concept of tracks to manage released versions of the app. The beta track is for public tests. Tests can be added via their Google E-Mail or by signing up at [play.google.com/apps/testing/tuerantuer.app.integreat](https://play.google.com/apps/testing/tuerantuer.app.integreat).

### BrowserStack

We are using BrowserStack to run our E2E tests on real iOS and Android devices.
The general documentation about E2E tests and BrowserStack for native development can be found [here](../native/docs/e2e-testing.md).

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

| Variable                | Description                    | Where do I get it from? | Reference                                                                                  |
| ----------------------- | ------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| BROWSERSTACK_ACCESS_KEY | Access Key for BrowserStack    | Password Manager        | [Appium REST API](https://www.browserstack.com/app-automate/rest-api)                      |
| BROWSERSTACK_USERNAME   | Username for BrowserStack      | Password Manager        | [Appium REST API](https://www.browserstack.com/app-automate/rest-api)                      |
| DELIVERINO_PRIVATE_KEY  | Base64 encoded PEM private key | Password Manager        | [Deliverino Settings](https://github.com/organizations/Integreat/settings/apps/deliverino) | [Deliverino](https://github.com/apps/deliverino) |

### Android Variables

| Variable                    | Description                                                                                                | Where do I get it from?                                                  | Reference                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| GOOGLE_SERVICE_ACCOUNT_JSON | JSON for authentication in the Google Play Console as Release Manager. This should expire after two years. | Password Manager                                                         | [Service Account Docu](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=de) |
| KEYSTORE_BASE64             | Base64 encoded encrypted keystore                                                                          | Password Manager                                                         | -                                                                                                      |
| KEYSTORE_ENCRYPTION_KEY     | Password for decrypting the keystore using OpenSSL                                                         | Password Manager                                                         | -                                                                                                      |
| KEY_ALIAS                   | Alias of the key within the Java Keystore                                                                  | You should look in the JKS file using `keytool -list -v -keystore <jks>` | -                                                                                                      |
| KEY_PASSWORD                | Password of the key within the Java Keystore                                                               | Password Manager                                                         | -                                                                                                      |
| KEYSTORE_PASSWORD           | Password of the JKS which can contain multiple keys                                                        | Password Manager                                                         | -                                                                                                      |
