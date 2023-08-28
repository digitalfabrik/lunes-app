import { Linking } from 'react-native'

import { log } from './sentry'

export const openExternalUrl = (url: string): Promise<void> =>
  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        // iOS Simulators do not support certain schemes like mailto or tel
        log(`Cannot handle url: ${url}`)
        return null
      }
      return Linking.openURL(url)
    })
    .catch()
