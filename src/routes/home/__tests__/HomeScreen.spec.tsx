import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../constants/labels.json'
import { useLoadDiscipline } from '../../../hooks/useLoadDiscipline'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import useReadCustomDisciplines from '../../../hooks/useReadCustomDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import AsyncStorageService from '../../../services/AsyncStorage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockCustomDiscipline } from '../../../testing/mockCustomDiscipline'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadCustomDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useLoadDiscipline')
jest.mock('../../../hooks/useLoadGroupInfo')
jest.mock('../../../components/HeaderWithMenu', () => {
  const Text = require('react-native').Text
  return () => <Text>HeaderWithMenu</Text>
})

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()

  it('should navigate to discipline', async () => {
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf(mockDisciplines().map(item => item.id)))
    mocked(useLoadDiscipline)
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[0]))
      .mockReturnValueOnce(getReturnOf(mockDisciplines()[1]))
    const { getByText } = render(<HomeScreen navigation={navigation} />)
    const firstDiscipline = getByText('First Discipline')
    const secondDiscipline = getByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    fireEvent.press(firstDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('DisciplineSelection', { discipline: mockDisciplines()[0] })
  })

  it('should show custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf(['abc']))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf([]))
    mocked(useLoadGroupInfo).mockReturnValueOnce(getReturnOf(mockCustomDiscipline))

    const { getByText } = render(<HomeScreen navigation={navigation} />)
    const customDiscipline = getByText('Custom Discipline')
    expect(customDiscipline).toBeDefined()

    fireEvent.press(customDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('DisciplineSelection', { discipline: mockCustomDiscipline })
  })

  it('should show suggestion to add custom discipline', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf([]))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf([]))
    mocked(useReadSelectedProfessions).mockReturnValue(getReturnOf([]))

    const { getByText } = render(<HomeScreen navigation={navigation} />)
    const addCustomDiscipline = getByText(labels.home.addCustomDiscipline)
    expect(addCustomDiscipline).toBeDefined()

    fireEvent.press(addCustomDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('AddCustomDiscipline')
  })
})
