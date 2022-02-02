import { RouteProp } from '@react-navigation/native'
import { render } from '@testing-library/react-native'
import React from 'react'
import { KeyboardAvoidingViewProps } from 'react-native'

import labels from '../../../constants/labels.json'
import { DocumentFromServer } from '../../../hooks/useLoadDocuments'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData, mockUseLoadAsyncWithError } from '../../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../../testing/wrapWithTheme'
import WriteExerciseScreen from '../WriteExerciseScreen'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn()
}))

jest.mock('react-native/Libraries/Image/Image', () => ({
  ...jest.requireActual('react-native/Libraries/Image/Image'),
  getSize: (uri: string, success: (w: number, h: number) => void) => {
    success(1234, 1234)
  }
}))

jest.mock('@react-navigation/elements')

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

type Props = KeyboardAvoidingViewProps & { children: React.ReactNode }
jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const KeyboardAwareScrollView = ({ children }: Props): React.ReactNode => children
  return { KeyboardAwareScrollView }
})

describe('WriteExerciseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const testDocuments: DocumentFromServer[] = [
    {
      audio: '',
      word: 'Arbeitshose',
      id: 1,
      article: 2,
      document_image: [{ id: 1, image: 'Arbeitshose' }],
      alternatives: []
    }
  ]

  const navigation = createNavigationMock<'WriteExercise'>()
  const route: RouteProp<RoutesParams, 'WriteExercise'> = {
    key: '',
    name: 'WriteExercise',
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

  it('should show network error', async () => {
    const errorMessage = 'Network Error'
    mockUseLoadAsyncWithError(errorMessage)
    const { findByText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    expect(await findByText(`${labels.general.error.noWifi} (${errorMessage})`)).toBeDefined()
  })

  it('should show exercise if loaded successfully', () => {
    mockUseLoadAsyncWithData(testDocuments)
    const { getByText, getByPlaceholderText } = render(<WriteExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    expect(getByText(labels.exercises.write.checkInput)).toBeDefined()
    expect(getByPlaceholderText(labels.exercises.write.insertAnswer)).toBeDefined()
  })
})
