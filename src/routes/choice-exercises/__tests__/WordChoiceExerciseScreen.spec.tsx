import { RouteProp } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../constants/labels.json'
import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadFromEndpointWitData } from '../../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../../testing/wrapWithTheme'
import WordChoiceExerciseScreen from '../WordChoiceExerciseScreen'

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('WordChoiceExerciseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // at least 4 documents are needed to generate sufficient false answers
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
    },
    {
      audio: '',
      word: 'Arbeitsjacke',
      id: 3,
      article: 1,
      document_image: [{ id: 3, image: 'Arbeitsjacke' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Arbeitskleidung',
      id: 4,
      article: 4,
      document_image: [{ id: 4, image: 'Arbeitskleidung' }],
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
        numberOfWords: 2
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadFromEndpointWitData(testDocuments)

    const { getByText } = render(<WordChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)
    expect(getByText('Arbeitsschuhe (Plural)')).not.toBeNull()
    fireEvent(getByText('Arbeitsschuhe (Plural)'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(getByText('Arbeitshose')).not.toBeNull()
    fireEvent(getByText('Arbeitshose'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(getByText('Arbeitsjacke')).not.toBeNull()
    fireEvent(getByText('Arbeitsjacke'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(getByText('Arbeitskleidung (Plural)')).not.toBeNull()
    fireEvent(getByText('Arbeitskleidung (Plural)'), 'pressOut')
    expect(getByText('Arbeitshose')).not.toBeNull()
    fireEvent(getByText('Arbeitshose'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.showResults))
  })

  it('should not allow to skip last document', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const { queryByText, getByText } = render(<WordChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(queryByText(labels.exercises.tryLater)).not.toBeNull()
    fireEvent(getByText('Arbeitshose'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    fireEvent(getByText('Arbeitsjacke'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    fireEvent(getByText('Arbeitskleidung (Plural)'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })
})
