const RELEASE_NOTES_DIR = 'release-notes'
const UNRELEASED_DIR = 'unreleased'
const GITKEEP_FILE = '.gitkeep'
const VERSION_FILE = 'version.json'

const DEFAULT_NOTES =
  'Wir haben die App weiter für Sie verbessert und einige Fehler entfernt. Wenn Sie bemerken, dass etwas nicht funktioniert, lassen Sie es uns wissen!\n'

const PLATFORM_ANDROID = 'android'
const PLATFORM_IOS = 'ios'

const PLATFORMS = [PLATFORM_IOS, PLATFORM_ANDROID]

const MAIN_BRANCH = 'main'

type ReleaseInformation = {
  platform: typeof PLATFORMS[number]
  versionName: string
}
const tagId = ({ platform, versionName }: ReleaseInformation): string => `${versionName}-${platform}`

export {
  RELEASE_NOTES_DIR,
  UNRELEASED_DIR,
  GITKEEP_FILE,
  VERSION_FILE,
  PLATFORM_IOS,
  PLATFORM_ANDROID,
  PLATFORMS,
  MAIN_BRANCH,
  DEFAULT_NOTES,
  tagId,
}
