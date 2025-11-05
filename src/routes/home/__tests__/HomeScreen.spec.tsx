import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import useProgress from '../../../hooks/useProgress'
import { StorageCache } from '../../../services/Storage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { renderWithStorageCache } from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  childrenLabel: jest.fn(() => []),
}))
jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useProgress')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useLoadDiscipline')
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

  it('should render professions', async () => {
    await storageCache.setItem(
      'selectedProfessions',
      mockDisciplines().map(item => item.id),
    )
    mocked(useLoadDiscipline)
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[0]))
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[1]))
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[2]))
    mocked(useProgress).mockReturnValue(0)
    const { findByText, getByText } = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    const firstDiscipline = await findByText('First Discipline')
    const secondDiscipline = await findByText('Second Discipline')
    const thirdDiscipline = getByText('Third Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    expect(thirdDiscipline).toBeDefined()
  })
})
