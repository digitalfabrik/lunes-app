import { mocked } from 'jest-mock'

import { mockJobs } from '../../testing/mockJob'
import { redeemCatalogCode } from '../CatalogService'
import { getCatalog, getJobsForKey } from '../CmsApi'
import { StorageCache } from '../Storage'

jest.mock('../CmsApi')

describe('CatalogService', () => {
  describe('redeemCatalogCode', () => {
    let storageCache: StorageCache

    beforeEach(() => {
      storageCache = StorageCache.createDummy()
      mocked(getCatalog).mockImplementation(async () => ({ name: 'telc gGmbH', shortName: 'telc' }))
      mocked(getJobsForKey).mockImplementation(async () => mockJobs())
    })

    it('should store the redeemed code as the key, with its jobs', async () => {
      const catalog = await redeemCatalogCode(storageCache, 'band-1')

      expect(getCatalog).toHaveBeenCalledWith('band-1')
      expect(getJobsForKey).toHaveBeenCalledWith('band-1')
      expect(catalog.apiKey).toBe('band-1')
      expect(catalog.name).toBe('telc gGmbH')
      expect(catalog.shortName).toBe('telc')
      expect(catalog.jobIds).toEqual([1, 2, 3])
      expect(storageCache.getItem('catalogs')).toHaveLength(1)
    })

    it('should not store the same catalog twice', async () => {
      await redeemCatalogCode(storageCache, 'band-1')
      await redeemCatalogCode(storageCache, 'band-1')

      expect(storageCache.getItem('catalogs')).toHaveLength(1)
    })

    it('should trim a pasted code', async () => {
      await redeemCatalogCode(storageCache, '  band-1 ')

      expect(getCatalog).toHaveBeenCalledWith('band-1')
    })
  })
})
