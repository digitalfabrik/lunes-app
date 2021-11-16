import { RouteProp } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../constants/labels.json'
import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadFromEndpointWithData } from '../../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../../testing/wrapWithTheme'
import ArticleChoiceExerciseScreen from '../ArticleChoiceExerciseScreen'

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('ArticleChoiceExerciseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testDocuments: DocumentTypeFromServer[] = [
    {
      audio: '',
      word: 'Arbeitshose',
      id: 1,
      article: 2,
      document_image: [{ id: 1, image: 'Arbeitshose' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Arbeitsschuhe',
      id: 2,
      article: 4,
      document_image: [{ id: 2, image: 'Arbeitsschuhe' }],
      alternatives: []
    }
  ]

  const navigation = createNavigationMock<'ArticleChoiceExercise'>()
  const route: RouteProp<RoutesParamsType, 'ArticleChoiceExercise'> = {
    key: '',
    name: 'ArticleChoiceExercise',
    params: {
      discipline: {
        id: 1,
        title: 'TestTitel',
        numberOfChildren: 2,
        isLeaf: true
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadFromEndpointWithData(testDocuments)

    const { getByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)
    expect(getByText('Arbeitsschuhe (Plural)')).not.toBeNull()
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(getByText('Arbeitshose (Plural)')).not.toBeNull()
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.showResults))
  })

  it('should not allow to skip last document', () => {
    mockUseLoadFromEndpointWithData(testDocuments)
    const { queryByText, getByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(queryByText(labels.exercises.tryLater)).not.toBeNull()
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })
})
