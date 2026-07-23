import { RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { StandardExerciseKey, EXERCISES, StandardExerciseKeys } from '../../../constants/data'
import { StandardUnitId } from '../../../models/Unit'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels, wordsDescription } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import ExerciseFinishedScreen from '../ExerciseFinishedScreen'

describe('ExerciseFinishedScreen', () => {
  const unitId: StandardUnitId = { type: 'standard', id: 1 }
  const navigation = createNavigationMock<'ExerciseFinished'>()
  const getRoute = (
    exerciseKey: StandardExerciseKey,
    allCorrect: boolean,
    isRepetition: boolean = false,
    numberOfDifficultWords: number = 0,
  ): RouteProp<RoutesParams, 'ExerciseFinished'> => {
    const vocabularyItems = new VocabularyItemBuilder(4).build()
    return {
      key: '',
      name: 'ExerciseFinished',
      params: {
        contentType: isRepetition ? 'repetition' : 'standard',
        unitId,
        unitTitle: 'unit',
        vocabularyItems,
        exercise: exerciseKey,
        results: vocabularyItems.map((vocabularyItem, index) => ({
          vocabularyItem,
          result: !allCorrect && index < numberOfDifficultWords ? 'incorrect' : 'correct',
          numberOfTries: index < numberOfDifficultWords ? 3 : 1,
        })),
      },
    }
  }

  it('should render the repetition modal outside of the repetition stack', () => {
    jest.mocked(navigation.addListener).mockImplementationOnce((event, callback) => {
      if (event === 'transitionEnd') {
        callback({ type: 'transitionEnd', data: { closing: false } })
      }
      return jest.fn()
    })
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, false, false, 3)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeTruthy()
  })

  it('should not render the repetition modal inside the repetition stack', () => {
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, false, true)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeFalsy()
  })

  it('should not render the repetition modal when only 2 words were difficult', () => {
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, false, false, 2)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeFalsy()
  })

  it('should render and handle button click for good feedback', () => {
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedUnit.replace('\n', ''))).toBeDefined()
  })

  it('should render and handle button click for bad feedback', () => {
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, false, false, 4)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.feedbackBad.replace('\n', ''))).toBeDefined()
    const button = getByText(getLabels().results.action.repeat)
    fireEvent.press(button)
    expect(navigation.popTo).toHaveBeenCalledWith(
      EXERCISES[StandardExerciseKeys.wordChoiceExercise].screen,
      expect.anything(),
    )
  })

  it('should render and handle button click for completed unit', () => {
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedUnit)).toBeDefined()
    const button = getByText(getLabels().results.action.finished)
    fireEvent.press(button)
    expect(navigation.pop).toHaveBeenCalled()
  })

  it('should count words as incorrect even if they have only initially been answered incorrectly', () => {
    const route = getRoute(StandardExerciseKeys.wordChoiceExercise, true, false, 4)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)

    const correctWords = 0
    const totalWords = 4
    const summaryMessage = `${correctWords} ${getLabels().results.of} ${wordsDescription(totalWords)} ${getLabels().results.correct}`
    expect(getByText(summaryMessage)).toBeVisible()
    expect(getByText(getLabels().results.action.repeat)).toBeVisible()
  })
})
