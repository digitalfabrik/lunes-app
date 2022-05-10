import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../constants/labels.json'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import ScopeSelection from '../ScopeSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')

describe('ScopeSelection', () => {
  const navigation = createNavigationMock<'ScopeSelection'>()
  const getRoute = (initialSelection = true): RouteProp<RoutesParams, 'ScopeSelection'> => ({
    key: '',
    name: 'ScopeSelection',
    params: {
      initialSelection
    }
  })

  it('should navigate to profession selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))

    const { getByText } = render(<ScopeSelection navigation={navigation} route={getRoute()} />)
    expect(getByText(labels.scopeSelection.welcome)).toBeDefined()
    const firstDiscipline = getByText('First Discipline')
    const secondDiscipline = getByText('Second Discipline')
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()

    fireEvent.press(firstDiscipline)

    expect(navigation.push).toHaveBeenCalledWith('ProfessionSelection', {
      discipline: mockDisciplines()[0],
      initialSelection: true
    })
  })

  it('should skip selection', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))
    const { getByText } = render(<ScopeSelection navigation={navigation} route={getRoute()} />)
    const button = getByText(labels.scopeSelection.skipSelection)
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('Home')
    })
  })

  it('should confirm selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))
    const { getByText } = render(<ScopeSelection navigation={navigation} route={getRoute()} />)
    const button = getByText(labels.scopeSelection.confirmSelection)
    fireEvent.press(button)

    expect(navigation.navigate).toHaveBeenCalledWith('Home')
  })

  it('should hide welcome message and buttons for non initial view', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))
    const { queryByText } = render(<ScopeSelection navigation={navigation} route={getRoute(false)} />)
    expect(queryByText(labels.scopeSelection.welcome)).toBeNull()
    expect(queryByText(labels.scopeSelection.skipSelection)).toBeNull()
    expect(queryByText(labels.scopeSelection.confirmSelection)).toBeNull()
  })
})
