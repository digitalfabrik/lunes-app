import { RouteProp } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import labels from '../../../constants/labels.json'
import { DocumentTypeFromServer } from '../../../hooks/useLoadDocuments'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import {
  mockUseLoadFromEndpointWitData,
  mockUseLoadFromEndpointWithError
} from '../../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../../testing/wrapWithTheme'
import WriteExerciseScreen from '../WriteExerciseScreen'

jest.mock('react-native/Libraries/Image/Image', () => {
  return {
    ...jest.requireActual('react-native/Libraries/Image/Image'),
    getSize: (uri: string, success: (w: number, h: number) => void) => {
      success(1234, 1234)
    }
  }
})
jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('WriteExerciseScreen', () => {
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

  const navigation = createNavigationMock<'WriteExercise'>()
  const route: RouteProp<RoutesParamsType, 'WriteExercise'> = {
    key: '',
    name: 'WriteExercise',
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
    mockUseLoadFromEndpointWitData(testDocuments)
    const getUri = (image: ReactTestInstance): string => image.props.source[0].uri

    const { getByRole, getByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(getUri(getByRole('image'))).toBe('Arbeitshose')
    const tryLater = getByText(labels.exercises.write.tryLater)
    fireEvent.press(tryLater)
    expect(getUri(getByRole('image'))).toBe('Arbeitsschuhe')
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    fireEvent.press(getByText(labels.exercises.next))
    expect(getUri(getByRole('image'))).toBe('Arbeitshose')
  })

  it('should not allow to skip last document', () => {
    mockUseLoadFromEndpointWitData(testDocuments)
    const { queryByText, getByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(queryByText('Später versuchen')).not.toBeNull()
    fireEvent.press(getByText('Lösung anzeigen'))
    fireEvent.press(getByText('Nächstes Wort'))
    expect(queryByText('Später versuchen')).toBeNull()
  })

  it('should show network error', () => {
    mockUseLoadFromEndpointWithError('Network Error')
    const { findByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    expect(findByText(labels.general.error.noWifi)).toBeDefined()
  })
})
