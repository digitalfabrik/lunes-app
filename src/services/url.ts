import { Linking } from 'react-native'

// fix ios issue for Django, that requires trailing slash in request url https://github.com/square/retrofit/issues/1037
export const addTrailingSlashToUrl = (url: string): string => (url.endsWith('/') ? url : `${url}/`)

export const openExternalUrl = (url: string): Promise<void> =>
  Linking.canOpenURL(url)
    .then(() => Linking.openURL(url))
    .catch()