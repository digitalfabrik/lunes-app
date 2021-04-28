const VERSION_FILE = 'version.json'

const PLATFORM_ANDROID = 'android'
const PLATFORM_IOS = 'ios'

const PLATFORMS = [PLATFORM_IOS, PLATFORM_ANDROID]

const tagId = ({ platform, versionName }) => `${versionName}-${platform}`

module.exports = { VERSION_FILE, PLATFORM_IOS, PLATFORM_ANDROID, PLATFORMS, tagId }
