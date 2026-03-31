import { RouteProp } from '@react-navigation/native'
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
          numberOfTries: !allCorrect && index < numberOfDifficultWords ? 3 : 1,
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
    const route = getRoute(1, false, false, 3)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeTruthy()
  })

  it('should not render the repetition modal inside the repetition stack', () => {
    const route = getRoute(1, false, true)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeFalsy()
  })

  it('should not render the repetition modal when only 2 words were difficult', () => {
    const route = getRoute(1, false, false, 2)
    const { queryByTestId } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(queryByTestId('repetition-modal')).toBeFalsy()
  })

  it('should render and handle button click for good feedback', () => {
    const route = getRoute(1, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedUnit.replace('\n', ''))).toBeDefined()
  })

  it('should render and handle button click for bad feedback', () => {
    const route = getRoute(1, false, false, 4)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.feedbackBad.replace('\n', ''))).toBeDefined()
    const button = getByText(getLabels().results.action.repeat)
    fireEvent.press(button)
    expect(navigation.popTo).toHaveBeenCalledWith(EXERCISES[1].screen, expect.anything())
  })

  it('should render and handle button click for completed unit', () => {
    const route = getRoute(1, true)
    const { getByText } = render(<ExerciseFinishedScreen route={route} navigation={navigation} />)
    expect(getByText(getLabels().results.finishedUnit)).toBeDefined()
    const button = getByText(getLabels().results.action.back)
    fireEvent.press(button)
    expect(navigation.pop).toHaveBeenCalled()
  })
})
