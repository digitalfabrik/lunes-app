import { RouteProp } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import labels from '../../constants/labels.json'
import { DocumentTypeFromServer } from '../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../navigation/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadFromEndpointWitData } from '../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../testing/wrapWithTheme'
import ArticleChoiceExerciseScreen from '../choice-exercises/ArticleChoiceExerciseScreen'

jest.mock('react-native/Libraries/Image/Image', () => {
  return {
    ...jest.requireActual('react-native/Libraries/Image/Image'),
    getSize: (uri: string, success: (w: number, h: number) => void) => {
      success(1234, 1234)
    }
  }
})
jest.mock('../../components/AudioPlayer', () => {
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
        numberOfWords: 2
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const getUri = (image: ReactTestInstance): string => image.props.source[0].uri

    const { getByRole, getByText, getByTestId } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />,
      {
        wrapper: wrapWithTheme
      }
    )

    expect(getUri(getByRole('image'))).toBe('Arbeitshose')
    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)
    expect(getUri(getByRole('image'))).toBe('Arbeitsschuhe')
    fireEvent(getByTestId('single-choice1'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(getUri(getByRole('image'))).toBe('Arbeitshose')
    fireEvent(getByTestId('single-choice1'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.showResults))
  })

  it('should not allow to skip last document', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const { queryByText, getByText, getByTestId } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />,
      {
        wrapper: wrapWithTheme
      }
    )

    expect(queryByText(labels.exercises.tryLater)).not.toBeNull()
    fireEvent(getByTestId('single-choice1'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })
})
