import { mocked } from 'jest-mock'

import { registerContentArea } from '../CmsApi'
import { redeemContentAreaCode } from '../ContentAreaService'
import { StorageCache } from '../Storage'

jest.mock('../CmsApi')

describe('ContentAreaService', () => {
  const telc = { id: 1, token: 'telc_token', name: 'telc gGmbH' }

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(registerContentArea).mockImplementation(async () => telc)
  })

  describe('redeemContentAreaCode', () => {
    it('should register the code and store the content area', async () => {
      const contentArea = await redeemContentAreaCode(storageCache, 'band-1')

      expect(registerContentArea).toHaveBeenCalledWith('band-1', undefined)
      expect(contentArea).toEqual(telc)
      expect(storageCache.getItem('contentAreas')).toEqual([telc])
    })

    it('should trim a pasted code', async () => {
      await redeemContentAreaCode(storageCache, '  band-1 ')

      expect(registerContentArea).toHaveBeenCalledWith('band-1', undefined)
    })

    it('should send the installation id only if analytics were consented to', async () => {
      await storageCache.setItem('analyticsConsent', { consentGiven: true, consentDate: '2026-09-16' })

      await redeemContentAreaCode(storageCache, 'band-1')

      expect(registerContentArea).toHaveBeenCalledWith('band-1', storageCache.getItem('installationId'))
    })

    it('should not create an installation id for a user who declined analytics', async () => {
      await storageCache.setItem('analyticsConsent', { consentGiven: false, consentDate: '2026-09-16' })

      await redeemContentAreaCode(storageCache, 'band-1')

      expect(storageCache.getItem('installationId')).toBeNull()
    })

    it('should keep one entry per content area when its code is redeemed again', async () => {
      await redeemContentAreaCode(storageCache, 'band-1')
      mocked(registerContentArea).mockImplementation(async () => ({ ...telc, token: 'fresh_token' }))

      await redeemContentAreaCode(storageCache, 'band-1')

      expect(storageCache.getItem('contentAreas')).toEqual([{ ...telc, token: 'fresh_token' }])
    })

    it('should not store anything if the code is unknown', async () => {
      mocked(registerContentArea).mockRejectedValue(new Error('invalid_area_code'))

      await expect(redeemContentAreaCode(storageCache, 'nope')).rejects.toThrow('invalid_area_code')
      expect(storageCache.getItem('contentAreas')).toEqual([])
    })
  })
})
