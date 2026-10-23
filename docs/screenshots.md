# Automatic screenshots

We are using [maestro](https://docs.maestro.dev/) for automatic screenshots.
Screenshots are stored in `android/fastlane/metadata/de-DE/images/` and `ios/fastlane/screenshots/de-DE/`.
The definition for the screenshot process can be found at `.maestro/screenshots.yaml`.
It can happen that the workflow breaks when we make changes to the app.
Usually it should be good enough to just update the expected texts.
If the maestro still cannot find an element, a good debugging tool is the `maestro studio`, which opens
an interactive debugger.

One important note, Android only allows eight screenshots per language.

## Updating screenshots

> [!WARNING]
> The process will overwrite any existing app data with the demo data.

To update the screenshots, the `maestro` command line tool needs to be installed.
`maestro` is available via homebrew and nix, or can be downloaded directly.
For more information, see the [docs](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli).
Use the version CI pins in `.circleci/src/commands/install_maestro.yml`.

### Android

For consistency all screenshots should be taken on a similar emulator.

To create the emulator:

1. Create a new device in the android device manager
2. Select 'Medium Phone' in the list
3. Use a recent android sdk

Then to take the screenshots:

1. Start the emulator
2. Build the app with `yarn android:production`
3. Take the screenshots with `yarn screenshots:android`

### iOS

The App Store requires screenshots for the 6.9" iPhone display and, because the app runs on iPad, the 13" iPad display.
They are taken on an iPhone 17 Pro Max (1320 x 2868 pixels) and an iPad Pro 13-inch (2064 x 2752 pixels) simulator.
Both sets are stored in `ios/fastlane/screenshots/de-DE/`, prefixed with `iphone_` and `ipad_`.
The App Store sorts them into device sets by resolution, so they have to stay in this one folder.

To take the screenshots, repeat the following for the iPhone and the iPad simulator:

1. Shut down all simulators with `xcrun simctl shutdown all`, then start the one you need; the script fails unless exactly one is booted
2. Build the app with `yarn ios:production --simulator "<simulator name>"`
3. Take the screenshots with `yarn screenshots:ios`, which names them after the booted simulator

## In CI

The screenshots can also be captured in CircleCI by triggering a pipeline with the
`run_update_screenshots` parameter set to `true` (CircleCI UI → Trigger Pipeline, or via the API).
This runs the `screenshot_android` job (on a Linux emulator) and the `screenshot_ios` job (on macOS
simulators for iPhone and iPad) and then opens or updates a single pull request on the `update-screenshots`
branch with the regenerated images for review.
