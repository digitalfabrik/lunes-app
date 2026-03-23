import { isConsentGiven, trackEventAsync } from '../AnalyticsService'
import { postAnalyticEvent } from '../CmsApi'
import { StorageCache } from '../Storage'

jest.mock('../CmsApi', () => ({
  postAnalyticEvent: jest.fn(),
}))

const payload = { type: 'job_selected', job_id: 1, action: 'add' } as const

describe('AnalyticsService', () => {
  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should not send a tracking event if consent has not been given', async () => {
    await trackEventAsync(storageCache, payload)

    expect(postAnalyticEvent).not.toHaveBeenCalled()
  })

  it('should send a tracking event if consent has been given', async () => {
    await storageCache.setItem('trackingConsent', { consentGiven: true, consentDate: '2024-01-01' })
    await trackEventAsync(storageCache, payload)

    expect(postAnalyticEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        installation_id: expect.any(String),
        payload,
      }),
    )
  })

  describe('isConsentGiven', () => {
    it('should return false if user has not been asked for consent yet', () => {
      expect(isConsentGiven(storageCache)).toBe(false)
    })

    it('should return false if user has declined consent', async () => {
      await storageCache.setItem('trackingConsent', { consentGiven: false, consentDate: '2024-01-01' })
      expect(isConsentGiven(storageCache)).toBe(false)
    })

    it('should return true if user has given consent', async () => {
      await storageCache.setItem('trackingConsent', { consentGiven: true, consentDate: '2024-01-01' })
      expect(isConsentGiven(storageCache)).toBe(true)
    })
  })
})
