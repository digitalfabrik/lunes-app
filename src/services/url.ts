import { Linking } from 'react-native'

// fix ios issue for Django, that requires trailing slash in request url https://github.com/square/retrofit/issues/1037
export const addTrailingSlashToUrl = (url: string): string => (url.endsWith('/') ? url : `${url}/`)

export const openExternalUrl = (url: string): Promise<void> =>
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        // emulators do not support certain schemes like mailto or tel
        console.log('Cannot handle url', url)
        return null
      }
      return Linking.openURL(url)
    })
    .catch()
