import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ExerciseKey, EXERCISES } from '../../../constants/data'
import { StandardUnitId } from '../../../models/Unit'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import ExerciseFinishedScreen from '../ExerciseFinishedScreen'

describe('ExerciseFinishedScreen', () => {
  const unitId: StandardUnitId = { type: 'standard', id: 1 }
  const navigation = createNavigationMock<'ExerciseFinished'>()
  const getRoute = (
    exerciseKey: ExerciseKey,
    allCorrect: boolean,
    isRepetition: boolean = false,
  ): RouteProp<RoutesParams, 'ExerciseFinished'> => ({
    key: '',
    name: 'ExerciseFinished',
    params: {
      contentType: isRepetition ? 'repetition' : 'standard',
      unitId,
      unitTitle: 'unit',
      vocabularyItems: new VocabularyItemBuilder(4).build(),
      closeExerciseAction: CommonActions.goBack(),
      exercise: exerciseKey,
      results: new VocabularyItemBuilder(4).build().map(vocabularyItem => ({
        vocabularyItem,
        result: allCorrect ? 'correct' : 'incorrect',
        numberOfTries: allCorrect ? 1 : 3,
      })),
    },
  })

  it('should render the repetition modal outside of the repetition stack', () => {
    const route = getRoute(1, false)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeTruthy()
  })

  it('should not render the repetition modal inside the repetition stack', () => {
    const route = getRoute(1, false, true)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeFalsy()
  })

  it('should render and handle button click for good feedback', () => {
    const route = getRoute(1, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedUnit.replace('\n', ''))).toBeDefined()
  })

  it('should render and handle button click for bad feedback', () => {
    const route = getRoute(1, false)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.feedbackBad.replace('\n', ''))).toBeDefined()
    const button = getByText(getLabels().results.action.repeat)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[1].screen, expect.anything())
  })

  it('should render and handle button click for completed unit', () => {
    const route = getRoute(1, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedUnit)).toBeDefined()
    const button = getByText(getLabels().results.action.back)
    fireEvent.press(button)
    expect(navigation.pop).toHaveBeenCalledWith(2)
  })
})
