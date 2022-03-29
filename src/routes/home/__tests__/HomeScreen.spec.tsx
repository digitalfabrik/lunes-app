import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import useReadCustomDisciplines from '../../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import AsyncStorageService from '../../../services/AsyncStorage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadCustomDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useLoadGroupInfo')

const mockCustomDiscipline = {
  id: 1,
  title: 'Custom Discipline',
  description: 'Description',
  icon: 'none',
  numberOfChildren: 1,
  isLeaf: false,
  apiKey: 'test',
  parentTitle: null,
  needsTrainingSetEndpoint: false
}

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()

  it('should navigate to discipline', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf(mockDisciplines))

    const { findByText } = render(<HomeScreen navigation={navigation} />)
    const firstDiscipline = await findByText('First Discipline')
    const secondDiscipline = await findByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()

    fireEvent.press(firstDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('DisciplineSelection', { discipline: mockDisciplines[0] })
  })

  it('should show custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf(['abc']))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf([]))
    mocked(useLoadGroupInfo).mockReturnValueOnce(getReturnOf(mockCustomDiscipline))

    const { findByText } = render(<HomeScreen navigation={navigation} />)
    const customDiscipline = await findByText('Custom Discipline')
    expect(customDiscipline).toBeDefined()

    fireEvent.press(customDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('DisciplineSelection', { discipline: mockCustomDiscipline })
  })
})
