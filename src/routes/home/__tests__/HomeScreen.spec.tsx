import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import useReadCustomDisciplines from '../../../hooks/useReadCustomDisciplines'
import useReadProgress from '../../../hooks/useReadProgress'
import { setCustomDisciplines } from '../../../services/AsyncStorage'
import { newDefaultStorage, StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockCustomDiscipline } from '../../../testing/mockCustomDiscipline'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { renderWithStorageCache } from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  childrenLabel: jest.fn(() => []),
}))
jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadCustomDisciplines')
jest.mock('../../../hooks/useReadProgress')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useLoadDiscipline')
jest.mock('../components/HomeScreenHeader', () => {
  const Text = require('react-native').Text
  return () => <Text>HeaderWithMenu</Text>
})

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()
  const storageCache = new StorageCache(newDefaultStorage())
  storageCache.setItem(
    'selectedProfessions',
    mockDisciplines().map(item => item.id),
  )

  beforeEach(async () => {
    await storageCache.setItem('selectedProfessions', [])
  })

  it('should render professions', async () => {
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    await storageCache.setItem(
      'selectedProfessions',
      mockDisciplines().map(item => item.id),
    )
    mocked(useLoadDiscipline)
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[0]))
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[1]))
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[2]))
    mocked(useReadProgress).mockReturnValue(0)
    const { findByText, getByText } = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    const firstDiscipline = await findByText('First Discipline')
    const secondDiscipline = await findByText('Second Discipline')
    const thirdDiscipline = getByText('Third Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    expect(thirdDiscipline).toBeDefined()
  })

  it('should render custom discipline', async () => {
    await setCustomDisciplines(['test'])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf(['abc']))
    mocked(useLoadDiscipline).mockReturnValueOnce(getReturnOf(mockCustomDiscipline))

    const { getByText } = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    expect(getByText('Custom Discipline')).toBeDefined()
    expect(getByText(getLabels().home.start)).toBeDefined()
  })

  it('should show suggestion to add custom discipline', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf([]))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))

    const { getByText } = renderWithStorageCache(storageCache, <HomeScreen navigation={navigation} />)
    const addCustomDiscipline = getByText(getLabels().home.addCustomDiscipline)
    expect(addCustomDiscipline).toBeDefined()

    fireEvent.press(addCustomDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('AddCustomDiscipline')
  })
})
