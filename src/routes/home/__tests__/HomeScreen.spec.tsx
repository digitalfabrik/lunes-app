import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import Job from '../../../models/Job'
import { getJob, getUnitsOfJob, getWordsByUnit } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockJobs } from '../../../testing/mockJob'
import { renderWithStorageCache } from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  childrenLabel: jest.fn(() => []),
}))
jest.mock('@react-navigation/native')
jest.mock('../../../services/CmsApi')
jest.mock('../components/HomeScreenHeader', () => {
  const Text = require('react-native').Text
  return () => <Text>HeaderWithMenu</Text>
})

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()
  let storageCache: StorageCache

  beforeEach(async () => {
    storageCache = StorageCache.createDummy()
  })

  it('should render jobs', async () => {
    await storageCache.setItem(
      'selectedJobs',
      mockJobs().map(item => item.id.id),
    )
    mocked(getJob).mockImplementation(id =>
      id.type === 'load-protected'
        ? Promise.reject()
        : Promise.resolve(mockJobs().find(item => item.id.id === id.id) as Job),
    )
    mocked(getUnitsOfJob).mockReturnValue(Promise.resolve([]))
    mocked(getWordsByUnit).mockReturnValue(Promise.resolve([]))
    const { findByText, getByText } = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    const firstJob = await waitFor(() => getByText('First Job'))
    const secondJob = await findByText('Second Job')
    const thirdJob = getByText('Third Job')
    expect(firstJob).toBeDefined()
    expect(secondJob).toBeDefined()
    expect(thirdJob).toBeDefined()
  })
})
