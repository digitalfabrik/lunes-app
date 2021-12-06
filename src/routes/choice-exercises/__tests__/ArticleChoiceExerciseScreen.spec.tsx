import { RouteProp } from '@react-navigation/native'
import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../constants/labels.json'
import { RoutesParamsType } from '../../../navigation/NavigationTypes'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../../testing/mockUseLoadFromEndpoint'
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

  const testDocuments: Document[] = [
    {
      audio: '',
      word: 'Helm',
      id: 1,
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [{ id: 1, image: 'Helm' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Auto',
      id: 2,
      article: {
        id: 3,
        value: 'Das'
      },
      document_image: [{ id: 2, image: 'Auto' }],
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
        isLeaf: true,
        isRoot: false,
        icon: 'my_icon',
        apiKey: 'my_api_key',
        description: ''
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadAsyncWithData(testDocuments)

    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(getAllByText(/Helm/)).toHaveLength(4)
    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Helm/)).toHaveLength(4)
  })

  it('should not allow to skip last document', () => {
    mockUseLoadAsyncWithData(testDocuments)
    const { queryByText, getByText, getAllByText } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />,
      {
        wrapper: wrapWithTheme
      }
    )

    expect(getAllByText(/Helm/)).toHaveLength(4)
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })

  it('should show word again when answered wrong', () => {
    mockUseLoadAsyncWithData(testDocuments)
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    expect(getAllByText(/Helm/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Helm/)).toHaveLength(4)
  })
})
