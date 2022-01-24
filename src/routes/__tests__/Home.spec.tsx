import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'
import { mocked } from 'ts-jest/utils'

import labels from '../../constants/labels.json'
import { ReturnType } from '../../hooks/useLoadAsync'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import { useLoadGroupInfo } from '../../hooks/useLoadGroupInfo'
import useReadCustomDisciplines from '../../hooks/useReadCustomDisciplines'
import AsyncStorageService from '../../services/AsyncStorage'
import createNavigationMock from '../../testing/createNavigationPropMock'
import wrapWithTheme from '../../testing/wrapWithTheme'
import HomeScreen from '../HomeScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useReadCustomDisciplines')
jest.mock('../../hooks/useLoadDisciplines')
jest.mock('../../hooks/useLoadGroupInfo')

const mockDisciplines = [
  {
    id: 1,
    title: 'First Discipline',
    description: 'Description1',
    icon: 'none',
    numberOfChildren: 1,
    isLeaf: false,
    isRoot: true,
    needsTrainingSetEndpoint: false
  },
  {
    id: 2,
    title: 'Second Discipline',
    description: 'Description1',
    icon: 'none',
    numberOfChildren: 1,
    isLeaf: false,
    isRoot: true,
    needsTrainingSetEndpoint: false
  }
]

const mockCustomDiscipline = {
  id: 1,
  title: 'Custom Discipline',
  description: 'Description',
  icon: 'none',
  numberOfChildren: 1,
  isLeaf: false,
  apiKey: 'test',
  isRoot: true,
  needsTrainingSetEndpoint: false
}

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()

  const getReturnTypeOf = <T,>(data: T): ReturnType<T> => {
    return {
      data: data,
      error: null,
      loading: false,
      refresh: () => {}
    }
  }

  it('should show discipline', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnTypeOf(mockDisciplines))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnTypeOf([]))

    const { findByText } = render(<HomeScreen navigation={navigation} />, { wrapper: wrapWithTheme })
    expect(await findByText('First Discipline')).toBeDefined()
    expect(await findByText('Second Discipline')).toBeDefined()
  })

  it('should show custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnTypeOf(mockDisciplines))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnTypeOf(['abc']))
    mocked(useLoadGroupInfo).mockReturnValueOnce(getReturnTypeOf(mockCustomDiscipline))

    const { findByText } = render(<HomeScreen navigation={navigation} />, { wrapper: wrapWithTheme })
    expect(await findByText('Custom Discipline')).toBeDefined()
  })

  it('should delete custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnTypeOf(mockDisciplines))
    mocked(useReadCustomDisciplines).mockReturnValue(getReturnTypeOf(['test']))
    mocked(useLoadGroupInfo).mockReturnValue(getReturnTypeOf(mockCustomDiscipline))
    const spyOnDeletion = jest.spyOn(AsyncStorageService, 'deleteCustomDiscipline')

    const { findByText, findByTestId } = render(<HomeScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    const customDiscipline = await findByText('Custom Discipline')
    expect(customDiscipline).toBeDefined()

    const row = await findByTestId('Swipeable')
    const swipeable = row.children[0] as ReactTestInstance
    swipeable.instance.openRight()

    const deleteIcon = await findByTestId('trash-bin-icon')
    expect(deleteIcon).toBeDefined()
    await fireEvent.press(deleteIcon)

    const confirmationModelConfirmButton = await findByText(labels.home.deleteModal.confirm)
    fireEvent.press(confirmationModelConfirmButton)

    expect(spyOnDeletion).toBeCalledTimes(1)
    expect(spyOnDeletion).toBeCalledWith('test')
  })
})
