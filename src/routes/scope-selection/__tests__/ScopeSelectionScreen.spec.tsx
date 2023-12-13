import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { Discipline } from '../../../constants/endpoints'
import { useLoadDisciplines } from '../../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render from '../../../testing/render'
import ScopeSelection, { searchProfessions } from '../ScopeSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDisciplines')
jest.mock('../../../hooks/useReadSelectedProfessions')

describe('ScopeSelection', () => {
  const navigation = createNavigationMock<'ScopeSelection'>()
  const getRoute = (initialSelection = true): RouteProp<RoutesParams, 'ScopeSelection'> => ({
    key: '',
    name: 'ScopeSelection',
    params: {
      initialSelection,
    },
  })

  it('should navigate to profession selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = render(<ScopeSelection navigation={navigation} route={getRoute()} />)
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
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf(null))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { getByText } = render(<ScopeSelection navigation={navigation} route={getRoute()} />)
    const button = getByText(getLabels().scopeSelection.skipSelection)
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigation.reset).toHaveBeenCalledWith({
        index: 0,
        routes: [{ name: 'BottomTabNavigator' }],
      })
    })
  })

  it('should confirm selection', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { getByText } = render(<ScopeSelection navigation={navigation} route={getRoute()} />)
    const button = getByText(getLabels().scopeSelection.confirmSelection)
    fireEvent.press(button)

    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'BottomTabNavigator' }],
    })
  })

  it('should hide welcome message and buttons for non initial view', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    const { queryByText } = render(<ScopeSelection navigation={navigation} route={getRoute(false)} />)
    expect(queryByText(getLabels().scopeSelection.welcome)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.skipSelection)).toBeNull()
    expect(queryByText(getLabels().scopeSelection.confirmSelection)).toBeNull()
  })

  describe('searchProfessions', () => {
    it('should find a profession', () => {
      const professions: Discipline[] = mockDisciplines()
      expect(searchProfessions(professions, 'disc')).toStrictEqual(professions)
      expect(searchProfessions(professions, 'SECOND')).toStrictEqual([professions[1]])
      expect(searchProfessions(professions, 'd discipline')).toStrictEqual([professions[1], professions[2]])
    })

    it('should not find a profession', () => {
      const professions: Discipline[] = mockDisciplines()
      expect(searchProfessions(professions, 'fourth discipline')).toStrictEqual([])
      expect(searchProfessions(professions, 'Maler')).toStrictEqual([])
    })
  })
})
