import { renderHook, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React, { ReactElement, ReactNode } from 'react'

import { getJob } from '../../services/CmsApi'
import { StorageCache, StorageCacheContext } from '../../services/Storage'
import { mockJobs } from '../../testing/mockJob'
import useLoadJob from '../useLoadJob'

jest.mock('../../services/CmsApi')

describe('useLoadJob', () => {
  let storageCache: StorageCache

  const wrapper = ({ children }: { children: ReactNode }): ReactElement =>
    React.createElement(StorageCacheContext.Provider, { value: storageCache }, children)

  beforeEach(async () => {
    storageCache = StorageCache.createDummy()
    mocked(getJob).mockResolvedValue(mockJobs()[0]!)
    await storageCache.setItem('catalogs', [
      { apiKey: 'telc_key', name: 'telc gGmbH', shortName: 'telc', jobIds: [42] },
    ])
  })

  it('should load a job of a redeemed partner with its key', async () => {
    renderHook(() => useLoadJob({ type: 'standard', id: 42 }), { wrapper })

    await waitFor(() => expect(getJob).toHaveBeenCalledWith({ type: 'standard', id: 42 }, 'telc_key'))
  })

  it('should load a public job without a key', async () => {
    renderHook(() => useLoadJob({ type: 'standard', id: 1 }), { wrapper })

    await waitFor(() => expect(getJob).toHaveBeenCalledWith({ type: 'standard', id: 1 }, undefined))
  })

  it('should not look up a key for a protected job', async () => {
    renderHook(() => useLoadJob({ type: 'load-protected', apiKey: 'legacy' }), { wrapper })

    await waitFor(() => expect(getJob).toHaveBeenCalledWith({ type: 'load-protected', apiKey: 'legacy' }, undefined))
  })
})
