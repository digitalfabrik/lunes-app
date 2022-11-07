import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import useReadSelectedProfessions from '../../hooks/useReadSelectedProfessions'
import { RoutesParams } from '../../navigation/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { getReturnOf } from '../../testing/helper'
import { mockDisciplines } from '../../testing/mockDiscipline'
import render from '../../testing/render'
import DisciplineSelectionScreen from '../DisciplineSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadDisciplines')
jest.mock('../../hooks/useReadSelectedProfessions')

describe('DisciplineSelectionScreen', () => {
  const navigation = createNavigationMock<'DisciplineSelection'>()
  const getRoute = (): RouteProp<RoutesParams, 'DisciplineSelection'> => ({
    key: 'key-1',
    name: 'DisciplineSelection',
    params: {
      discipline: mockDisciplines()[1],
    },
  })

  it('should display the correct title', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))

    const { getByText } = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation} />)
    const title = getByText(mockDisciplines()[0].title)
    expect(title).toBeDefined()
  })

  it('should display all disciplines', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))
    mocked(useReadSelectedProfessions).mockReturnValueOnce(getReturnOf([mockDisciplines()[0].id]))

    const { getByText, findByText } = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation} />)

    const firstDiscipline = await findByText(mockDisciplines()[0].title)
    const secondDiscipline = await findByText(mockDisciplines()[0].title)
    const thirdDiscipline = getByText(mockDisciplines()[0].title)
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    expect(thirdDiscipline).toBeDefined()
  })

  it('should navigate to exercises when list item pressed', async () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = render(<DisciplineSelectionScreen route={getRoute()} navigation={navigation} />)
    const discipline = getByText(mockDisciplines()[2].title)
    expect(discipline).toBeDefined()
    fireEvent.press(discipline)

    await waitFor(() =>
      expect(navigation.navigate).toHaveBeenCalledWith('Exercises', {
        discipline: mockDisciplines()[2],
        disciplineTitle: mockDisciplines()[2].title,
        disciplineId: mockDisciplines()[2].id,
        documents: null,
      })
    )
  })
})
