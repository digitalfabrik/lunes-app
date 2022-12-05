import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import WordChoiceExerciseScreen from '../WordChoiceExerciseScreen'

jest.useFakeTimers()

jest.mock('../../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})
jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})
jest.mock('react-native-image-zoom-viewer', () => {
  const Text = require('react-native').Text
  return () => <Text>ImageZoomViewer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('WordChoiceExerciseScreen', () => {
  // at least 4 vocabularyItems are needed to generate sufficient false answers
  const vocabularyItems = new VocabularyItemBuilder(4).build()

  const navigation = createNavigationMock<'WordChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'WordChoiceExercise'> = {
    key: '',
    name: 'WordChoiceExercise',
    params: {
      vocabularyItems,
      disciplineId: 1,
      disciplineTitle: 'TestTitel',
      closeExerciseAction: CommonActions.goBack(),
    },
  }
  it('should allow to skip an exercise and try it out later', () => {
    const { getByText, queryByText } = render(<WordChoiceExerciseScreen route={route} navigation={navigation} />)

    const tryLater = getByText(getLabels().exercises.tryLater)
    fireEvent.press(tryLater)

    let correctAnswer = getByText('Auto')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    correctAnswer = getByText('Hose')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    correctAnswer = getByText('Helm')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(queryByText(getLabels().exercises.tryLater)).toBeNull()
    correctAnswer = getByText('Spachtel')
    fireEvent(correctAnswer, 'pressOut')
    expect(getByText(getLabels().exercises.showResults)).toBeDefined()
  })
})
