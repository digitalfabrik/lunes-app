import { waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { Discipline } from '../../../constants/endpoints'
import { isTypeLoadProtected } from '../../../hooks/helpers'
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
      mockJobs().map(item => item.id),
    )
    mocked(getJob).mockImplementation(id =>
      isTypeLoadProtected(id)
        ? Promise.reject()
        : Promise.resolve(mockJobs().find(item => item.id === id.disciplineId) as Discipline),
    )
    mocked(getUnitsOfJob).mockReturnValue(Promise.resolve([]))
    mocked(getWordsByUnit).mockReturnValue(Promise.resolve([]))
    const { findByText, getByText } = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    const firstDiscipline = await waitFor(() => getByText('First Discipline'))
    const secondDiscipline = await findByText('Second Discipline')
    const thirdDiscipline = getByText('Third Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    expect(thirdDiscipline).toBeDefined()
  })
})
