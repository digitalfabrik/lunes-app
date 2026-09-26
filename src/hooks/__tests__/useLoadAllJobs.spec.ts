import { mocked } from 'jest-mock'

import { StandardJob } from '../../models/Job'
import { getJobs } from '../../services/CmsApi'
import { StorageCache } from '../../services/Storage'
import { reportError } from '../../services/sentry'
import { mockJobs } from '../../testing/mockJob'
import { loadAllJobs } from '../useLoadAllJobs'

jest.mock('../../services/CmsApi')
jest.mock('../../services/sentry')

describe('useLoadAllJobs', () => {
  const lunesJobsMock: StandardJob[] = mockJobs()

  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should return the public jobs if no contentArea was redeemed', async () => {
    mocked(getJobs).mockImplementation(async () => lunesJobsMock)
    const response = await loadAllJobs(storageCache)
    expect(response).toStrictEqual(lunesJobsMock)
  })

  describe('when a contentArea was redeemed', () => {
    const telc = { id: 1, token: 'telc_token', name: 'telc gGmbH', code: 'TELC2026' }
    const contentAreaJobsMock: StandardJob[] = [
      { id: { type: 'standard', id: 101 }, name: 'Telc Job', icon: 'none', numberOfUnits: 1, migrated: false },
    ]

    const mockPublicAndContentAreaJobs = () =>
      mocked(getJobs).mockImplementation(async token => (token === undefined ? lunesJobsMock : contentAreaJobsMock))

    it('should request the jobs of every redeemed contentArea and place them ahead of the public jobs', async () => {
      mockPublicAndContentAreaJobs()
      await storageCache.setItem('contentAreas', [telc])

      const response = await loadAllJobs(storageCache)

      expect(getJobs).toHaveBeenCalledWith(telc.token)
      expect(response).toHaveLength(lunesJobsMock.length + contentAreaJobsMock.length)
      expect(response.slice(0, contentAreaJobsMock.length)).toStrictEqual(contentAreaJobsMock)
    })

    it('should keep the public jobs if the token of a contentArea is rejected', async () => {
      mocked(getJobs).mockImplementation(async token => {
        if (token !== undefined) {
          throw new Error('unauthorized')
        }
        return lunesJobsMock
      })
      await storageCache.setItem('contentAreas', [telc])

      const response = await loadAllJobs(storageCache)

      expect(response).toStrictEqual(lunesJobsMock)
      expect(reportError).toHaveBeenCalled()
    })
  })
})
