import AnalyticsService from '../AnalyticsService'
import { postAnalyticEvent } from '../CmsApi'
import { StorageCache } from '../Storage'

jest.mock('../CmsApi', () => ({
  postAnalyticEvent: jest.fn(),
}))

jest.mock('react-native-device-info', () => ({
  ...jest.requireActual('react-native-device-info/jest/react-native-device-info-mock'),
  getInstanceId: jest.fn().mockResolvedValue('test-instance-id'),
}))

const payload = { type: 'job_selected', jobId: 1, action: 'add' } as const

describe('AnalyticsService', () => {
  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should not send a tracking event if consent has not been given', async () => {
    const service = new AnalyticsService(storageCache)

    await service.trackEventAsync(payload)

    expect(postAnalyticEvent).not.toHaveBeenCalled()
  })

  it('should send a tracking event if consent has been given', async () => {
    await storageCache.setItem('trackingConsent', { consentDate: '2024-01-01' })
    const service = new AnalyticsService(storageCache)

    await service.trackEventAsync(payload)

    expect(postAnalyticEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        installationId: 'test-instance-id',
        payload,
      }),
    )
  })
})
