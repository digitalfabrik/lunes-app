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

class AnalyticsService {
  constructor(private readonly storageCache: StorageCache) {}

  public isConsentGiven = (): boolean => this.storageCache.getItem('trackingConsent') !== null

  public trackEvent = (data: TrackingPayload): void => {
    this.trackEventAsync(data).catch(reportError)
  }

  public trackEventAsync = async (data: TrackingPayload): Promise<void> => {
    if (!this.isConsentGiven()) {
      return
    }

    const event = {
      installation_id: await DeviceInfo.getInstanceId(),
      timestamp: new Date().toISOString(),
      payload: data,
    }
    await postAnalyticEvent(event)
  }
}

export const trackEvent = (storageCache: StorageCache, payload: TrackingPayload): void =>
  new AnalyticsService(storageCache).trackEvent(payload)

export default AnalyticsService
