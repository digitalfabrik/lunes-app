# Lunes App

Android and iOS React native Apps for [Lunes](https://lunes.app)

If you are interested in contributing, write an e-mail to [Steffi](mailto:stefanie.metzger@tuerantuer.org)
for development issues or to [Daniel](mailto:info@lunes.app) for non-technical stuff.

## Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Project setup](#project-setup)
- [Conventions](#contributing)
- [Project Structure](#project-structure)
- [Further Reading](#further-reading)

## Getting Started

### Prerequisites

- Rate our Lunes app in the [PlayStore](https://play.google.com/store/apps/details?id=app.lunes)
  and the [Apple App Store](https://apps.apple.com/de/app/lunes/id1562834995).
- Install [nodejs](https://nodejs.org/).
- Install [yarn](https://yarnpkg.com/).

### Project setup

We suggest **[IntelliJ](https://www.jetbrains.com/idea/)** as IDE on Linux or Mac.
If you are using a different IDE like Visual Studio Code, follow the steps [here](./docs/vscode.md).
If you want to develop on Windows, follow the steps [here](./docs/setup-windows-android-emulator.md).

- Import this project (VCS > Get from Version Control) and open it.
- Run `yarn` in the terminal to install all dependencies.
- Take a look at the [available scripts](package.json).

#### Android

- Install the Android SDK by using the [Android Support plugin](https://plugins.jetbrains.com/plugin/1792-android-support) in IntelliJ.
- Install the latest stable SDK Platform and Android SDK Tools in the SDK Manager (Settings > Appearance & Behaviour > System Settings > Android SDK)
- \[optional\]: If you want to develop using an emulator, also install the Android Emulator in the Android SDK settings
- run `yarn start` and `yarn android`

#### iOS

- Own a Mac or another Apple device.
- Install [XCode](https://developer.apple.com/xcode/)
- In `/ios` run `bundle install` and `bundle exec pod install`

_Note: In order to work with the project in XCode, always open `ios/Lunes.xcworkspace`._

#### Additional Configuration

- [optional] Install the following plugins:
  - [Styled Components](https://plugins.jetbrains.com/plugin/9997-styled-components--styled-jsx/)
  - [Ruby](https://plugins.jetbrains.com/plugin/1293-ruby) (if working with Fastlane)

## Conventions

Our [conventions](docs/conventions.md) can be found here

## Further Reading

Documentation on [CI/CD](docs/cicd.md) and more can be found in `/docs`.
