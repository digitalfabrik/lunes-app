import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import labels from '../../../constants/labels.json'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import { useLoadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import useReadCustomDisciplines from '../../../hooks/useReadCustomDisciplines'
import AsyncStorageService from '../../../services/AsyncStorage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import HomeScreen from '../HomeScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useReadCustomDisciplines')
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
    mocked(useLoadGroupInfo).mockReturnValueOnce(getReturnOf(mockCustomDiscipline))

    const { findByText } = render(<HomeScreen navigation={navigation} />)
    const customDiscipline = await findByText('Custom Discipline')
    expect(customDiscipline).toBeDefined()

    fireEvent.press(customDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('DisciplineSelection', { discipline: mockCustomDiscipline })
  })

  it('should delete custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnOf(['test']))
    mocked(useLoadGroupInfo).mockReturnValue(getReturnOf(mockCustomDiscipline))
    const spyOnDeletion = jest.spyOn(AsyncStorageService, 'removeCustomDiscipline')

    const { findByText, findByTestId } = render(<HomeScreen navigation={navigation} />)
    const customDiscipline = await findByText('Custom Discipline')
    expect(customDiscipline).toBeDefined()

    const row = await findByTestId('Swipeable')
    const swipeable = row.children[0] as ReactTestInstance
    swipeable.instance.openRight()

    const deleteIcon = await findByTestId('trash-icon')
    expect(deleteIcon).toBeDefined()
    await fireEvent.press(deleteIcon)

    const confirmationModelConfirmButton = await findByText(labels.home.deleteModal.confirm)
    fireEvent.press(confirmationModelConfirmButton)

    expect(spyOnDeletion).toHaveBeenCalledTimes(1)
    expect(spyOnDeletion).toHaveBeenCalledWith('test')
  })
})
