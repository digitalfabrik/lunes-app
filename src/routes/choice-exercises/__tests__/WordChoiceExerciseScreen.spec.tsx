import { RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import DocumentBuilder from '../../../testing/DocumentBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../../testing/mockUseLoadFromEndpoint'
import render from '../../../testing/render'
import WordChoiceExerciseScreen from '../WordChoiceExerciseScreen'

jest.useFakeTimers()

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn()
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
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // at least 4 documents are needed to generate sufficient false answers
  const testDocuments = new DocumentBuilder(4).build()

  const navigation = createNavigationMock<'WordChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'WordChoiceExercise'> = {
    key: '',
    name: 'WordChoiceExercise',
    params: {
      discipline: {
        id: 1,
        title: 'TestTitel',
        numberOfChildren: 2,
        isLeaf: true,
        description: '',
        icon: '',
        parentTitle: 'parent',
        needsTrainingSetEndpoint: false
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadAsyncWithData(testDocuments)

    const { getByText, queryByText } = render(<WordChoiceExerciseScreen route={route} navigation={navigation} />)

    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)

    let correctAnswer = getByText('Auto')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    correctAnswer = getByText('Hose')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    correctAnswer = getByText('Helm')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(queryByText(labels.exercises.tryLater)).toBeNull()
    correctAnswer = getByText('Spachtel')
    fireEvent(correctAnswer, 'pressOut')
    expect(getByText(labels.exercises.showResults)).toBeDefined()
  })
})
