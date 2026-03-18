import DeviceInfo from 'react-native-device-info'

import { postAnalyticEvent } from './CmsApi'
import { StorageCache } from './Storage'
import { reportError } from './sentry'

export type TrackingConsent = {
  consentDate: string
}

export type TrackingEvent = {
  installation_id: string
  timestamp: string
  payload: TrackingPayload
}

export type TrackingPayload = {
  type: 'job_selected'
  job_id: number
  action: 'add' | 'remove'
}

export const isConsentGiven = (storageCache: StorageCache): boolean => storageCache.getItem('trackingConsent') !== null

export const trackEventAsync = async (storageCache: StorageCache, data: TrackingPayload): Promise<void> => {
  if (!isConsentGiven(storageCache)) {
    return
  }

  const event = {
    installation_id: await DeviceInfo.getInstanceId(),
    timestamp: new Date().toISOString(),
    payload: data,
  }
  await postAnalyticEvent(event)
}

export const trackEvent = (storageCache: StorageCache, payload: TrackingPayload): void => {
  trackEventAsync(storageCache, payload).catch(reportError)
}
