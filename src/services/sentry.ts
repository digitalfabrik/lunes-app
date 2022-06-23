/* eslint-disable no-console */
import * as Sentry from '@sentry/react-native'

import AsyncStorage from './AsyncStorage'

export const initSentry = (): void => {
  if (!__DEV__) {
    Sentry.init({
      dsn: 'https://8e99e20eb419461d8a539a15e09199d8@sentry.tuerantuer.org/3'
    })
  }
}

export const log = (message: string, level = 'debug'): void => {
  if (__DEV__) {
    switch (level) {
      case Sentry.Severity.Fatal:
      case Sentry.Severity.Critical:
      case Sentry.Severity.Error:
        console.error(message)
        break
      case Sentry.Severity.Warning:
        console.warn(message)
        break
      case Sentry.Severity.Log:
        console.log(message)
        break
      case Sentry.Severity.Info:
        console.info(message)
        break
      case Sentry.Severity.Debug:
        console.debug(message)
        break
    }
  } else {
    Sentry.addBreadcrumb({
      message,
      level: Sentry.Severity.fromString(level)
    })
  }
}

export const reportError = (err: unknown): void => {
  if (__DEV__) {
    console.error('Sentry reported error: ', err)
  } else {
    AsyncStorage.isTrackingEnabled()
      .then(isTrackingEnabled => {
        if (isTrackingEnabled) {
          Sentry.captureException(err)
        }
      })
      .catch(() => Sentry.captureException(err))
  }
}
