import { postAnalyticEvent } from './CmsApi'
import { StorageCache } from './Storage'
import { reportError } from './sentry'
import { getInstallationId } from './storageUtils'

export type AnalyticsConsent = {
  consentGiven: boolean
  consentDate: string
}

export type AnalyticsEvent = {
  installation_id: string
  timestamp: string
  payload: AnalyticsPayload
}

export type AnalyticsPayload = {
  type: 'job_selected'
  job_id: number
  action: 'add' | 'remove'
}

export const isConsentGiven = (storageCache: StorageCache): boolean => {
  const consent = storageCache.getItem('analyticsConsent')
  return consent !== null && consent.consentGiven
}

export const trackEventAsync = async (storageCache: StorageCache, data: AnalyticsPayload): Promise<void> => {
  if (!isConsentGiven(storageCache)) {
    return
  }
  const event = {
    installation_id: await getInstallationId(storageCache),
    timestamp: new Date().toISOString(),
    payload: data,
  }
  await postAnalyticEvent(event)
}

export const trackEvent = (storageCache: StorageCache, payload: AnalyticsPayload): void => {
  trackEventAsync(storageCache, payload).catch(reportError)
}
