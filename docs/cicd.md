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
- **dev_delivery**: [Manually triggerable](#triggering-a-delivery-using-the-ci) workflow which delivers builds to development.
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

### App Store Connect

#### Authenticating

Authentication happens by setting the `APP_STORE_CONNECT_API_KEY_CONTENT` environment variable as documented [below](#ios-variables).

### BrowserStack

We are using BrowserStack to run our E2E tests on real iOS and Android devices.

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

| Variable                | Description                    | Where do I get it from? | Reference                                                                                  |                                                  |
| ----------------------- | ------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------ |
| BROWSERSTACK_ACCESS_KEY | Access Key for BrowserStack    | Password Manager        | [Appium REST API](https://www.browserstack.com/app-automate/rest-api)                      |                                                  |
| BROWSERSTACK_USERNAME   | Username for BrowserStack      | Password Manager        | [Appium REST API](https://www.browserstack.com/app-automate/rest-api)                      |                                                  |
| DELIVERINO_PRIVATE_KEY  | Base64 encoded PEM private key | Password Manager        | [Deliverino Settings](https://github.com/organizations/Integreat/settings/apps/deliverino) | [Deliverino](https://github.com/apps/deliverino) |

### Android Variables

| Variable                       | Description                                                                                                | Where do I get it from?                                                  | Reference                                                                                              |                                                                              |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| GOOGLE_SERVICE_ACCOUNT_JSON    | JSON for authentication in the Google Play Console as Release Manager. This should expire after two years. | Password Manager                                                         | [Service Account Docu](https://cloud.google.com/iam/docs/creating-managing-service-account-keys?hl=de) |                                                                              |
| CREDENTIALS_GIT_REPOSITORY_URL | Git remote URL to the credentials repository which contains the Java Keystore                              | Ask the team about this secret repository                                | git@github.com:User/credentials.git                                                                    | -                                                                            |
| CREDENTIALS_DIRECTORY_PATH     | Path where the credentials Git repository cloned to automatically by FL                                    | The developer can choose this freely                                     | /tmp/credentials                                                                                       | -                                                                            |
| CREDENTIALS_KEYSTORE_PATH      | Path to the GPG encrypted Java Keystore file                                                               | -                                                                        | /tmp/credentials/<secret>.gpg                                                                          | Look for the `gpg` command in the Android Fastlane file for more information |
| CREDENTIALS_KEYSTORE_PASSWORD  | Password for decrypting the keystore using GPG                                                             |                                                                          | password                                                                                               | -                                                                            |
| KEYSTORE_PATH                  | Path to the decrypted Java Keystore file                                                                   | -                                                                        | /tmp/keystore.jks                                                                                      | -                                                                            |
| KEYSTORE_PASSWORD              | Password of the JKS which can contain multiple keys                                                        | Password Manager                                                         | 123456                                                                                                 | -                                                                            |
| KEYSTORE_KEY_ALIAS             | Alias of the key within the Java Keystore                                                                  | You should look in the JKS file using `keytool -list -v -keystore <jks>` | -                                                                                                      |                                                                              |
| KEYSTORE_KEY_PASSWORD          | Password of the key within the Java Keystore                                                               | Password Manager                                                         | -                                                                                                      |                                                                              |

### iOS Variables

| Variable                          | Description                                                                                                                | Where do I get it from?                  | Example                                                                    | Reference                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| APP_STORE_CONNECT_API_KEY_ID      | Key ID for App Store Connect API                                                                                           | AppStoreConnect                          | D83848D23                                                                  | [app_store_connect_api_key](https://docs.fastlane.tools/actions/app_store_connect_api_key/) |
| APP_STORE_CONNECT_API_ISSUER_ID   | Issuer ID for App Store Connect API                                                                                        | AppStoreConnect                          | 227b0bbf-ada8-458c-9d62-3d8022b7d07f                                       | [app_store_connect_api_key](https://docs.fastlane.tools/actions/app_store_connect_api_key/) |
| APP_STORE_CONNECT_API_KEY_CONTENT | Key content for App Store Connect API                                                                                      | Password Manager (same as for Integreat) | -----BEGIN EC PRIVATE KEY-----\nfewfawefawfe\n-----END EC PRIVATE KEY----- | [app_store_connect_api_key](https://docs.fastlane.tools/actions/app_store_connect_api_key/) |
| MATCH_PASSWORD                    | Password for accessing the certificates for the iOS app using [Fastlane Match](https://docs.fastlane.tools/actions/match/) | Password Manager                         | 123456                                                                     | [Using a Git Repo](https://docs.fastlane.tools/actions/match/#git-repo-encryption-password) |
