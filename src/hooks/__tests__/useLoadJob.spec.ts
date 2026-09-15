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
    await storageCache.setItem('selectedJobs', [{ id: 42, token: 'telc_token' }, { id: 1 }])
  })

  it('should load a job of a content area with the token stored for it', async () => {
    renderHook(() => useLoadJob({ type: 'standard', id: 42 }), { wrapper })

    await waitFor(() => expect(getJob).toHaveBeenCalledWith({ type: 'standard', id: 42 }, 'telc_token'))
  })

  it('should load a public job without a token', async () => {
    renderHook(() => useLoadJob({ type: 'standard', id: 1 }), { wrapper })

    await waitFor(() => expect(getJob).toHaveBeenCalledWith({ type: 'standard', id: 1 }, undefined))
  })
})
