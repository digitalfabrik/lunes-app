import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { renderWithStorageCache } from '../../../testing/render'
import ScopeSelection from '../JobSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDisciplines')

describe('JobSelection', () => {
  const navigation = createNavigationMock<'JobSelection'>()
  const getRoute = (initialSelection = true): RouteProp<RoutesParams, 'JobSelection'> => ({
    key: '',
    name: 'JobSelection',
    params: {
      initialSelection,
    },
  })

  const storageCache = StorageCache.createDummy()

  beforeEach(async () => {
    await storageCache.setItem('selectedJobs', null)
  })

  it('should navigate to job selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute()} />,
    )
    expect(getByText(getLabels().scopeSelection.welcome)).toBeDefined()
    const firstDiscipline = getByText('First Discipline')
    const secondDiscipline = getByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()

    fireEvent.press(firstDiscipline)

    expect(navigation.navigate).toHaveBeenCalledWith('JobSelection', {
      discipline: mockDisciplines()[0],
      initialSelection: true,
    })
  })

  it('should skip selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute()} />,
    )
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
    await storageCache.setItem('selectedJobs', [mockDisciplines()[0].id])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute()} />,
    )
    const button = getByText(getLabels().scopeSelection.confirmSelection)
    fireEvent.press(button)

    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  })

  it('should hide welcome message and buttons for non initial view', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    await storageCache.setItem('selectedJobs', [mockDisciplines()[0].id])
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { queryByText } = renderWithStorageCache(
      storageCache,
      <ScopeSelection navigation={navigation} route={getRoute(false)} />,
    )
    expect(queryByText(getLabels().scopeSelection.welcome)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.skipSelection)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.confirmSelection)).toBeNull()
  })
})
