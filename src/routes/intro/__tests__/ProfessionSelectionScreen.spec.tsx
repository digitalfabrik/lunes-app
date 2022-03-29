import { RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../constants/labels.json'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import AsyncStorageService from '../../../services/AsyncStorage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import ProfessionSelectionScreen from '../ProfessionSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')

describe('ProfessionSelectionScreen', () => {
  const navigation = createNavigationMock<'ProfessionSelection'>()
  const route: RouteProp<RoutesParams, 'ProfessionSelection'> = {
    key: 'key-1',
    name: 'ProfessionSelection',
    params: {
      discipline: {
        id: 5,
        title: 'Parent Discipline',
        description: 'Parent Description',
        icon: 'none',
        numberOfChildren: 2,
        isLeaf: false,
        parentTitle: null,
        needsTrainingSetEndpoint: false
      }
    }
  }

  it('should select profession when clicked', async () => {
    await AsyncStorageService.setSelectedProfessions([])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))
    const spyOnPush = jest.spyOn(AsyncStorageService, 'pushSelectedProfession')

    const { findByText, queryAllByTestId } = render(<ProfessionSelectionScreen route={route} navigation={navigation} />)
    expect(await findByText(labels.intro.skipSelection)).toBeDefined()
    const profession = await findByText(mockDisciplines[0].title)
    expect(profession).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(0)
    fireEvent.press(profession)
    expect(spyOnPush).toHaveBeenCalledTimes(1)
    expect(spyOnPush).toHaveBeenCalledWith(mockDisciplines[0])
  })

  it('should unselect profession when clicked', async () => {
    await AsyncStorageService.setSelectedProfessions([mockDisciplines[0]])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines[0]]))
    const spyOnRemove = jest.spyOn(AsyncStorageService, 'removeSelectedProfession')

    const { findByText, queryAllByTestId } = render(<ProfessionSelectionScreen route={route} navigation={navigation} />)
    expect(await findByText(labels.intro.confirmSelection)).toBeDefined()
    const profession = await findByText(mockDisciplines[0].title)
    expect(profession).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(1)
    fireEvent.press(profession)

    expect(spyOnRemove).toHaveBeenCalledTimes(1)
    expect(spyOnRemove).toHaveBeenCalledWith(mockDisciplines[0])
  })
})
