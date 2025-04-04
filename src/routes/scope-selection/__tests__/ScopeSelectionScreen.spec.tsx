import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { newDefaultStorage } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { renderWithStorage } from '../../../testing/render'
import ScopeSelection from '../ScopeSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDisciplines')

describe('ScopeSelection', () => {
  const navigation = createNavigationMock<'ScopeSelection'>()
  const getRoute = (initialSelection = true): RouteProp<RoutesParams, 'ScopeSelection'> => ({
    key: '',
    name: 'ScopeSelection',
    params: {
      initialSelection,
    },
  })

  const storage = newDefaultStorage()

  beforeEach(async () => {
    await storage.selectedProfessions.set(null)
  })

  it('should navigate to profession selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = renderWithStorage(storage, <ScopeSelection navigation={navigation} route={getRoute()} />)
    expect(getByText(getLabels().scopeSelection.welcome)).toBeDefined()
    const firstDiscipline = getByText('First Discipline')
    const secondDiscipline = getByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()

    fireEvent.press(firstDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('ProfessionSelection', {
      discipline: mockDisciplines()[0],
      initialSelection: true,
    })
  })

  it('should skip selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { getByText } = renderWithStorage(storage, <ScopeSelection navigation={navigation} route={getRoute()} />)
    const button = getByText(getLabels().scopeSelection.skipSelection)
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'BottomTabNavigator' }],
      })
    })
  })

  it('should confirm selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    await storage.selectedProfessions.set([mockDisciplines()[0].id])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { getByText } = renderWithStorage(storage, <ScopeSelection navigation={navigation} route={getRoute()} />)
    const button = getByText(getLabels().scopeSelection.confirmSelection)
    fireEvent.press(button)

    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  })

  it('should hide welcome message and buttons for non initial view', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    await storage.selectedProfessions.set([mockDisciplines()[0].id])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { queryByText } = renderWithStorage(
      storage,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )
    expect(queryByText(getLabels().scopeSelection.welcome)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.skipSelection)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.confirmSelection)).toBeNull()
  })
})
