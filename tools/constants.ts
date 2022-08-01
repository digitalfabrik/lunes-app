const RELEASE_NOTES_DIR = 'release-notes'
const UNRELEASED_DIR = 'unreleased'
const GITKEEP_FILE = '.gitkeep'
const VERSION_FILE = 'version.json'

const DEFAULT_NOTES =
  'Wir haben hinter den Kulissen hart gearbeitet, um sicherzustellen, dass alles so funktioniert, wie es soll. Wenn Sie bemerken, dass etwas nicht funktioniert, lassen Sie es uns wissen!\n'

const PLATFORM_ANDROID = 'android'
const PLATFORM_IOS = 'ios'

const PLATFORMS = [PLATFORM_IOS, PLATFORM_ANDROID]

interface ReleaseInformation {
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
  DEFAULT_NOTES,
  tagId,
}
