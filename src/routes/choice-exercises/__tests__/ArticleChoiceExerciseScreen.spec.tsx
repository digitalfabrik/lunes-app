import { RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import DocumentBuilder from '../../../testing/DocumentBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../../testing/mockUseLoadFromEndpoint'
import render from '../../../testing/render'
import ArticleChoiceExerciseScreen from '../ArticleChoiceExerciseScreen'

jest.useFakeTimers()

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn()
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('ArticleChoiceExerciseScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const documents = new DocumentBuilder(2).build()

  const navigation = createNavigationMock<'ArticleChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'ArticleChoiceExercise'> = {
    key: '',
    name: 'ArticleChoiceExercise',
    params: {
      discipline: {
        id: 1,
        title: 'TestTitel',
        numberOfChildren: 2,
        isLeaf: true,
        parentTitle: 'parent',
        icon: 'my_icon',
        apiKey: 'my_api_key',
        description: '',
        needsTrainingSetEndpoint: false
      }
    }
  }
  it('should allow to skip an exercise and try it out later', () => {
    mockUseLoadAsyncWithData(documents)

    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)
    expect(getAllByText(/Spachtel/)).toHaveLength(4)
    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
  })

  it('should not allow to skip last document', () => {
    mockUseLoadAsyncWithData(documents)
    const { queryByText, getByText, getAllByText } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />
    )

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
    fireEvent(getByText('Der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })

  it('should show word again when answered wrong', () => {
    mockUseLoadAsyncWithData(documents)
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('Das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
  })
})
