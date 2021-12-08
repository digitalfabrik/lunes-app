import { RouteProp } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../../testing/wrapWithTheme'
import WordChoiceExerciseScreen from '../WordChoiceExerciseScreen'

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
  const testDocuments: DocumentType[] = [
    {
      audio: '',
      word: 'Hose',
      id: 1,
      article: {
        id: 2,
        value: 'Die'
      },
      document_image: [{ id: 1, image: 'image' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Helm',
      id: 2,
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [{ id: 2, image: 'image' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Auto',
      id: 3,
      article: {
        id: 3,
        value: 'Das'
      },
      document_image: [{ id: 3, image: 'image' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Hammer',
      id: 4,
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [{ id: 4, image: 'image' }],
      alternatives: []
    }
  ]

  const navigation = createNavigationMock<'WordChoiceExercise'>()
  const route: RouteProp<RoutesParamsType, 'WordChoiceExercise'> = {
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
        isRoot: false,
        needsTrainingSetEndpoint: false
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadAsyncWithData(testDocuments)

    const { getByText, queryByText } = render(<WordChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)

    let correctAnswer = getByText('Helm')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    correctAnswer = getByText('Auto')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    correctAnswer = getByText('Hammer')
    fireEvent(correctAnswer, 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(queryByText(labels.exercises.tryLater)).toBeNull()
    correctAnswer = getByText('Hose')
    fireEvent(correctAnswer, 'pressOut')
    expect(getByText(labels.exercises.showResults)).toBeDefined()
  })
})
