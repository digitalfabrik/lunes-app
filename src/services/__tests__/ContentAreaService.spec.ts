import { mocked } from 'jest-mock'

import { mockJobs } from '../../testing/mockJob'
import { getContentAreaBranding, getJobs, registerContentArea } from '../CmsApi'
import {
  redeemContentAreaCode,
  reattachSelectedJobsToContentAreas,
  refreshContentAreaBranding,
} from '../ContentAreaService'
import { StorageCache } from '../Storage'

jest.mock('../CmsApi')

describe('ContentAreaService', () => {
  const telc = { id: 1, token: 'telc_token', name: 'telc gGmbH', code: 'TELC2026' }

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

    it('should keep the selected jobs of an area attached to it when its code is redeemed again', async () => {
      await redeemContentAreaCode(storageCache, 'band-1')
      await storageCache.setItem('selectedJobs', [
        { id: 1, token: telc.token },
        { id: 2 },
        { id: 3, token: 'other_token' },
      ])
      mocked(registerContentArea).mockImplementation(async () => ({ ...telc, token: 'fresh_token' }))

      await redeemContentAreaCode(storageCache, 'band-1')

      expect(storageCache.getItem('selectedJobs')).toEqual([
        { id: 1, token: 'fresh_token' },
        { id: 2 },
        { id: 3, token: 'other_token' },
      ])
    })

    it('should not write the selected jobs if none of them belongs to the redeemed area', async () => {
      await redeemContentAreaCode(storageCache, 'band-1')
      await storageCache.setItem('selectedJobs', [{ id: 2 }, { id: 3, token: 'other_token' }])
      mocked(registerContentArea).mockImplementation(async () => ({ ...telc, token: 'fresh_token' }))
      const listener = jest.fn()
      storageCache.addListener('selectedJobs', listener)

      await redeemContentAreaCode(storageCache, 'band-1')

      expect(listener).not.toHaveBeenCalled()
    })

    it('should not touch the selected jobs if the area has not been redeemed before', async () => {
      await storageCache.setItem('selectedJobs', [{ id: 2 }])

      await redeemContentAreaCode(storageCache, 'band-1')

      expect(storageCache.getItem('selectedJobs')).toEqual([{ id: 2 }])
    })

    it('should not store anything if the code is unknown', async () => {
      mocked(registerContentArea).mockRejectedValue(new Error('invalid_area_code'))

      await expect(redeemContentAreaCode(storageCache, 'nope')).rejects.toThrow('invalid_area_code')
      expect(storageCache.getItem('contentAreas')).toEqual([])
    })
  })

  describe('refreshContentAreaBranding', () => {
    const oldTelc = { ...telc, primaryColor: '#111111', logoUrl: 'https://lunes.example/old.png' }

    beforeEach(async () => {
      await storageCache.setItem('contentAreas', [oldTelc])
    })

    it('should update the branding and keep the token of a stored area', async () => {
      mocked(getContentAreaBranding).mockResolvedValue({
        logoUrl: 'https://lunes.example/new.png',
        primaryColor: '#a01915',
        learningColor: '#007dbe',
      })

      await refreshContentAreaBranding(storageCache)

      expect(getContentAreaBranding).toHaveBeenCalledWith('TELC2026')
      expect(storageCache.getItem('contentAreas')).toEqual([
        { ...telc, logoUrl: 'https://lunes.example/new.png', primaryColor: '#a01915', learningColor: '#007dbe' },
      ])
    })

    it('should drop branding the CMS no longer serves', async () => {
      mocked(getContentAreaBranding).mockResolvedValue({ primaryColor: '#a01915', logoUrl: undefined })

      await refreshContentAreaBranding(storageCache)

      expect(storageCache.getItem('contentAreas')[0]?.logoUrl).toBeUndefined()
    })

    it('should keep the stored branding if the CMS cannot be reached', async () => {
      mocked(getContentAreaBranding).mockRejectedValue(new Error('Network Error'))

      await refreshContentAreaBranding(storageCache)

      expect(storageCache.getItem('contentAreas')).toEqual([oldTelc])
    })

    it('should refresh the other areas if one cannot be reached', async () => {
      const band = { id: 2, token: 'band_token', name: 'band', code: 'BAND1', primaryColor: '#222222' }
      await storageCache.setItem('contentAreas', [oldTelc, band])
      mocked(getContentAreaBranding).mockImplementation(async code => {
        if (code === 'TELC2026') {
          throw new Error('Network Error')
        }
        return { primaryColor: '#333333' }
      })

      await refreshContentAreaBranding(storageCache)

      expect(storageCache.getItem('contentAreas')).toEqual([oldTelc, { ...band, primaryColor: '#333333' }])
    })

    it('should not write to the storage if the branding is unchanged', async () => {
      mocked(getContentAreaBranding).mockResolvedValue({
        logoUrl: oldTelc.logoUrl,
        primaryColor: oldTelc.primaryColor,
      })
      const contentAreasBefore = storageCache.getItem('contentAreas')
      const listener = jest.fn()
      storageCache.addListener('contentAreas', listener)

      await refreshContentAreaBranding(storageCache)

      expect(listener).not.toHaveBeenCalled()
      expect(storageCache.getItem('contentAreas')).toBe(contentAreasBefore)
    })
  })

  describe('reattachSelectedJobsToContentAreas', () => {
    const [firstJob, secondJob, thirdJob] = mockJobs()

    beforeEach(async () => {
      await storageCache.setItem('contentAreas', [telc])
      mocked(getJobs).mockResolvedValue([firstJob!, secondJob!])
    })

    it('should give a job with an outdated token the current token of the area that has the job', async () => {
      await storageCache.setItem('selectedJobs', [
        { id: firstJob!.id.id, token: 'outdated_token' },
        { id: secondJob!.id.id, token: telc.token },
      ])

      await reattachSelectedJobsToContentAreas(storageCache)

      expect(getJobs).toHaveBeenCalledWith(telc.token)
      expect(storageCache.getItem('selectedJobs')).toEqual([
        { id: firstJob!.id.id, token: telc.token },
        { id: secondJob!.id.id, token: telc.token },
      ])
    })

    it('should attach each job to the area that has it', async () => {
      const band = { id: 2, token: 'band_token', name: 'band', code: 'BAND1' }
      await storageCache.setItem('contentAreas', [telc, band])
      mocked(getJobs).mockImplementation(async token => (token === band.token ? [thirdJob!] : [firstJob!]))
      await storageCache.setItem('selectedJobs', [
        { id: firstJob!.id.id, token: 'outdated_token' },
        { id: thirdJob!.id.id, token: 'another_outdated_token' },
      ])

      await reattachSelectedJobsToContentAreas(storageCache)

      expect(storageCache.getItem('selectedJobs')).toEqual([
        { id: firstJob!.id.id, token: telc.token },
        { id: thirdJob!.id.id, token: band.token },
      ])
    })

    it('should leave a job as it is if more than one area has it', async () => {
      const band = { id: 2, token: 'band_token', name: 'band', code: 'BAND1' }
      await storageCache.setItem('contentAreas', [telc, band])
      mocked(getJobs).mockResolvedValue([firstJob!])
      await storageCache.setItem('selectedJobs', [{ id: firstJob!.id.id, token: 'outdated_token' }])

      await reattachSelectedJobsToContentAreas(storageCache)

      expect(storageCache.getItem('selectedJobs')).toEqual([{ id: firstJob!.id.id, token: 'outdated_token' }])
    })

    it('should leave a job that no area has as it is', async () => {
      await storageCache.setItem('selectedJobs', [{ id: thirdJob!.id.id, token: 'outdated_token' }])

      await reattachSelectedJobsToContentAreas(storageCache)

      expect(storageCache.getItem('selectedJobs')).toEqual([{ id: thirdJob!.id.id, token: 'outdated_token' }])
    })

    it('should leave the jobs as they are if the jobs of an area cannot be loaded', async () => {
      mocked(getJobs).mockRejectedValue(new Error('Network Error'))
      await storageCache.setItem('selectedJobs', [{ id: firstJob!.id.id, token: 'outdated_token' }])

      await reattachSelectedJobsToContentAreas(storageCache)

      expect(storageCache.getItem('selectedJobs')).toEqual([{ id: firstJob!.id.id, token: 'outdated_token' }])
    })

    it('should not load anything if every job with a token belongs to a known area', async () => {
      await storageCache.setItem('selectedJobs', [{ id: firstJob!.id.id, token: telc.token }, { id: thirdJob!.id.id }])

      await reattachSelectedJobsToContentAreas(storageCache)

      expect(getJobs).not.toHaveBeenCalled()
    })
  })
})
