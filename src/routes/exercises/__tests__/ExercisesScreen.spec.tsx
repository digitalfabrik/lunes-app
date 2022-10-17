import RNAsyncStorage from '@react-native-async-storage/async-storage'
import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { EXERCISES, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../../../constants/data'
import useLoadDocuments from '../../../hooks/useLoadDocuments'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { mockUseLoadAsyncWithData } from '../../../testing/mockUseLoadFromEndpoint'
import render from '../../../testing/render'
import ExercisesScreen from '../ExercisesScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDocuments')

describe('ExercisesScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(1).build()
  beforeEach(() => {
    jest.clearAllMocks()
    RNAsyncStorage.clear()
    mocked(useLoadDocuments).mockReturnValue(getReturnOf(vocabularyItems))
  })

  const navigation = createNavigationMock<'Exercises'>()
  const route: RouteProp<RoutesParams, 'Exercises'> = {
    key: 'key-0',
    name: 'Exercises',
    params: {
      disciplineId: mockDisciplines()[0].id,
      disciplineTitle: mockDisciplines()[0].title,
      discipline: mockDisciplines()[0],
      vocabularyItems: null,
    },
  }

  mockUseLoadAsyncWithData({
    [route.params.disciplineId]: {
      '0': SCORE_THRESHOLD_POSITIVE_FEEDBACK - 1,
      '1': SCORE_THRESHOLD_POSITIVE_FEEDBACK + 1,
    },
  })

  it('should render correctly', () => {
    const { getAllByText } = render(<ExercisesScreen route={route} navigation={navigation} />)
    EXERCISES.forEach(exercise => {
      expect(getAllByText(exercise.title)).toBeDefined()
      expect(getAllByText(exercise.description)).toBeDefined()
    })
  })

  it('should show modal on navigation if locked', async () => {
    const { getByText, getByTestId } = render(<ExercisesScreen route={route} navigation={navigation} />)
    expect(getByTestId('locking-modal')).toHaveProp('visible', false)
    const lockedExercise = getByText(EXERCISES[1].title)
    fireEvent.press(lockedExercise)
    expect(getByTestId('locking-modal')).toHaveProp('visible', true)
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('should trigger navigation if unlocked', () => {
    const { getAllByText } = render(<ExercisesScreen route={route} navigation={navigation} />)
    const nextExercise = getAllByText(EXERCISES[0].title)
    fireEvent.press(nextExercise[1])
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[0].screen, {
      closeExerciseAction: undefined,
      disciplineId: mockDisciplines()[0].id,
      disciplineTitle: mockDisciplines()[0].title,
      vocabularyItems,
    })
  })

  it('should show feedback badge for done levels', async () => {
    const { queryByTestId } = render(<ExercisesScreen route={route} navigation={navigation} />)
    await waitFor(() => expect(queryByTestId('positive-badge')).not.toBeNull())
  })

  it('should not show feedback badge for wordlist level', async () => {
    const { queryByTestId } = render(<ExercisesScreen route={route} navigation={navigation} />)
    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
  })
})
