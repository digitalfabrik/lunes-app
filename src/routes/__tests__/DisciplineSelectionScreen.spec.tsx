import { RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { useLoadDisciplines } from '../../hooks/useLoadDisciplines'
import { RoutesParams } from '../../navigation/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { getReturnOf } from '../../testing/helper'
import { mockDisciplines } from '../../testing/mockDiscipline'
import render from '../../testing/render'
import DisciplineSelectionScreen from '../DisciplineSelectionScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadDisciplines')

describe('DisciplineSelectionScreen', () => {
  const navigation = createNavigationMock<'DisciplineSelection'>()
  const parentDiscipline = {
    id: 0,
    title: 'Parent Discipline',
    description: 'Description0',
    icon: 'none',
    numberOfChildren: 1,
    isLeaf: false,
    parentTitle: null,
    needsTrainingSetEndpoint: false,
    leafDisciplines: [10, 11],
  }

  const route: RouteProp<RoutesParams, 'DisciplineSelection'> = {
    key: 'key-1',
    name: 'DisciplineSelection',
    params: {
      discipline: parentDiscipline,
    },
  }

  it('should display the correct title', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = render(<DisciplineSelectionScreen route={route} navigation={navigation} />)
    const title = getByText(mockDisciplines()[0].title)
    expect(title).toBeDefined()
  })

  it('should display all disciplines', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = render(<DisciplineSelectionScreen route={route} navigation={navigation} />)

    const firstDiscipline = getByText(mockDisciplines()[0].title)
    const secondDiscipline = getByText(mockDisciplines()[1].title)
    const thirdDiscipline = getByText(mockDisciplines()[2].title)
    expect(firstDiscipline).toBeDefined()
    expect(secondDiscipline).toBeDefined()
    expect(thirdDiscipline).toBeDefined()
  })

  it('should navigate to exercises when list item pressed', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = render(<DisciplineSelectionScreen route={route} navigation={navigation} />)
    const discipline = getByText(mockDisciplines()[2].title)
    expect(discipline).toBeDefined()
    fireEvent.press(discipline)

    expect(navigation.navigate).toHaveBeenCalledWith('Exercises', {
      discipline: mockDisciplines()[2],
      disciplineTitle: mockDisciplines()[2].title,
      disciplineId: mockDisciplines()[2].id,
      vocabularyItems: null,
    })
  })

  it('should navigate to exercises when non-leaf list item pressed', () => {
    mocked(useLoadDisciplines).mockReturnValueOnce(getReturnOf(mockDisciplines()))

    const { getByText } = render(<DisciplineSelectionScreen route={route} navigation={navigation} />)
    const discipline = getByText(mockDisciplines()[1].title)
    expect(discipline).toBeDefined()
    fireEvent.press(discipline)

    expect(navigation.push).toHaveBeenCalledWith('DisciplineSelection', {
      discipline: mockDisciplines()[1],
    })
  })
})
