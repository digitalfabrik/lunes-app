/* eslint-disable no-console */
import * as Sentry from '@sentry/react-native'
import { SeverityLevel } from '@sentry/types'

import { getStorageItem } from './Storage'

export const initSentry = (): void => {
  if (!__DEV__) {
    Sentry.init({
      dsn: 'https://8e99e20eb419461d8a539a15e09199d8@sentry.tuerantuer.org/3',
    })
  }
}

export const log = (message: string, level: SeverityLevel = 'debug'): void => {
  if (__DEV__) {
    switch (level) {
      case 'fatal':
      case 'error':
        console.error(message)
        break
      case 'warning':
        console.warn(message)
        break
      case 'log':
        console.log(message)
        break
      case 'info':
        console.info(message)
        break
      case 'debug':
        console.debug(message)
        break
    }
  } else {
    Sentry.addBreadcrumb({ message, level })
  }
}

export const reportError = (err: unknown): void => {
  if (__DEV__) {
    console.error('Sentry reported error: ', err)
  } else {
    getStorageItem('isTrackingEnabled')
      .then(isTrackingEnabled => {
        if (isTrackingEnabled) {
          Sentry.captureException(err)
        }
      })
      .catch(Sentry.captureException)
  }
}
