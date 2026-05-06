# Automatic screenshots

We are using [maestro](https://docs.maestro.dev/) for automatic screenshots.
Screenshots are stored in `android/fastlane/metadata/de-DE/images/` and `ios/fastlane/screenshots/de-DE/`.
The definition for the screenshot process can be found at `.maestro/screenshots.yaml`.
It can happen that the workflow breaks when we make changes to the app.
Usually it should be good enough to just update the expected texts.
If the maestro still cannot find an element, a good debugging tool is the `maestro studio`, which opens
an interactive debugger.

## Updating screenshots

> [!WARNING]
> The process will overwrite any existing app data with the demo data.

To update the screenshots, the `maestro` command line tool needs to be installed.
`maestro` is available via homebrew and nix, or can be downloaded directly.
For more information, see the [docs](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli).

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

All screenshots are taken on an iPhone 16 Pro.
To take the screenshots:

1. Start the simulator
2. Build the app with `yarn ios:production`
3. Take the screenshots with `yarn screenshots:ios`
