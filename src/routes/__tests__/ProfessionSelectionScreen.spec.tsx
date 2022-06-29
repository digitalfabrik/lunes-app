import AsyncStorage from '@react-native-async-storage/async-storage'
import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../constants/labels.json'
import { COLORS } from '../../constants/theme/colors'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorageService from '../../services/AsyncStorage'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { getReturnOf } from '../../testing/helper'
import { mockDisciplines } from '../../testing/mockDiscipline'
import render from '../../testing/render'
import ProfessionSelectionScreen from '../ProfessionSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadDisciplines')
jest.mock('../../hooks/useReadSelectedProfessions')

describe('ProfessionSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    AsyncStorage.clear()
  })

  const navigation = createNavigationMock<'ProfessionSelection'>()
  const getRoute = (initialSelection = true): RouteProp<RoutesParams, 'ProfessionSelection'> => ({
    key: 'key-1',
    name: 'ProfessionSelection',
    params: {
      initialSelection,
      discipline: {
        id: 5,
        title: 'Parent Discipline',
        description: 'Parent Description',
        icon: 'none',
        numberOfChildren: 2,
        isLeaf: false,
        parentTitle: null,
        needsTrainingSetEndpoint: false,
        leafDisciplines: []
      }
    }
  })

  it('should select profession when pressed', async () => {
    await AsyncStorageService.setSelectedProfessions([])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))

    const { findByText, queryAllByTestId } = render(
      <ProfessionSelectionScreen route={getRoute()} navigation={navigation} />
    )
    expect(await findByText(labels.scopeSelection.skipSelection)).toBeDefined()
    const profession = await findByText(mockDisciplines()[0].title)
    expect(profession).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(0)
    fireEvent.press(profession)
    await waitFor(async () => {
      const selectedProfessions = await AsyncStorageService.getSelectedProfessions()
      expect(selectedProfessions).toEqual([mockDisciplines()[0].id])
    })
  })

  it('should unselect profession when pressed', async () => {
    await AsyncStorageService.setSelectedProfessions([mockDisciplines()[0].id])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))

    const { findByText, queryAllByTestId } = render(
      <ProfessionSelectionScreen route={getRoute()} navigation={navigation} />
    )
    expect(await findByText(labels.scopeSelection.confirmSelection)).toBeDefined()
    const profession = await findByText(mockDisciplines()[0].title)
    expect(profession).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(1)
    fireEvent.press(profession)

    await waitFor(async () => {
      const selectedProfessions = await AsyncStorageService.getSelectedProfessions()
      expect(selectedProfessions).toEqual([])
    })
  })

  it('should disable selection when not initial view', async () => {
    await AsyncStorageService.setSelectedProfessions([mockDisciplines()[0].id])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))

    const { findAllByTestId } = render(<ProfessionSelectionScreen route={getRoute(false)} navigation={navigation} />)
    const professions = await findAllByTestId('list-item')
    expect(professions[0].props.style[0].backgroundColor).toEqual(COLORS.disabled)
  })

  it('should navigate on selection when not initial view', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))

    const { findByText } = render(<ProfessionSelectionScreen route={getRoute(false)} navigation={navigation} />)
    const profession = await findByText(mockDisciplines()[0].title)
    fireEvent.press(profession)
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('ManageSelection'))
  })
})
