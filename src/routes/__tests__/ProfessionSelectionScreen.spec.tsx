import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { getStorageItem, newDefaultStorage, setStorageItem } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { getReturnOf } from '../../testing/helper'
import { mockDisciplines } from '../../testing/mockDiscipline'
import { renderWithStorage } from '../../testing/render'
import ProfessionSelectionScreen from '../ProfessionSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadDisciplines')

describe('ProfessionSelectionScreen', () => {
  const navigation = createNavigationMock<'ProfessionSelection'>()
  const getRoute = (initialSelection: boolean): RouteProp<RoutesParams, 'ProfessionSelection'> => ({
    key: 'key-1',
    name: 'ProfessionSelection',
    params: {
      initialSelection,
      discipline: mockDisciplines()[1],
    },
  })

  const storage = newDefaultStorage()
  const renderScreen = (initialSelection = true) =>
    renderWithStorage(storage, <ProfessionSelectionScreen route={getRoute(initialSelection)} navigation={navigation} />)

  beforeEach(async () => {
    await storage.selectedProfessions.set(null)
  })

  it('should select profession when pressed', async () => {
    await setStorageItem('selectedProfessions', [])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { findByText, queryAllByTestId } = renderScreen()
    expect(await findByText(getLabels().scopeSelection.skipSelection)).toBeDefined()
    const profession = await findByText(mockDisciplines()[0].title)
    expect(profession).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(0)
    fireEvent.press(profession)
    await waitFor(async () => {
      const selectedProfessions = await getStorageItem('selectedProfessions')
      expect(selectedProfessions).toEqual([mockDisciplines()[0].id])
    })
  })

  it('should unselect profession when pressed', async () => {
    await setStorageItem('selectedProfessions', [mockDisciplines()[0].id])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    await storage.selectedProfessions.set([mockDisciplines()[0].id])

    const { findByText, queryAllByTestId } = renderScreen()
    expect(await findByText(getLabels().scopeSelection.confirmSelection)).toBeDefined()
    const profession = await findByText(mockDisciplines()[0].title)
    expect(profession).toBeDefined()
    expect(queryAllByTestId('check-icon')).toHaveLength(1)
    fireEvent.press(profession)

    await waitFor(async () => {
      const selectedProfessions = await getStorageItem('selectedProfessions')
      expect(selectedProfessions).toEqual([])
    })
  })

  it('should disable selection when not initial view', async () => {
    await storage.selectedProfessions.set([mockDisciplines()[0].id])

    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { findAllByTestId } = renderScreen(false)
    const professions = await findAllByTestId('list-item')
    expect(professions[0]).toHaveStyle({ backgroundColor: COLORS.disabled })
  })

  it('should navigate on selection when not initial view', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { findByText } = renderScreen(false)
    const profession = await findByText(mockDisciplines()[0].title)
    fireEvent.press(profession)
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('ManageSelection'))
  })
})
