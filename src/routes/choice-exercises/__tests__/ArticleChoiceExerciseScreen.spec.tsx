import { CommonActions, RouteProp } from '@react-navigation/native'
import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ExerciseKeys, SIMPLE_RESULTS } from '../../../constants/data'
import labels from '../../../constants/labels.json'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { saveExerciseProgress } from '../../../services/AsyncStorage'
import DocumentBuilder from '../../../testing/DocumentBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import ArticleChoiceExerciseScreen from '../ArticleChoiceExerciseScreen'

jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it)
}))

jest.mock('../../../services/AsyncStorage', () => ({
  getExerciseProgress: jest.fn(() => ({})),
  saveExerciseProgress: jest.fn(),
  getDevMode: jest.fn(async () => false)
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')
jest.useFakeTimers()
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
      documents,
      disciplineId: 1,
      disciplineTitle: 'TestTitel',
      closeExerciseAction: CommonActions.goBack()
    }
  }

  it('should allow to skip an exercise and try it out later', () => {
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)
    expect(getAllByText(/Spachtel/)).toHaveLength(4)
    const tryLater = getByText(labels.exercises.tryLater)
    fireEvent.press(tryLater)

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
  })

  it('should not allow to skip last document', () => {
    const { queryByText, getByText, getAllByText } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />
    )

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
    fireEvent(getByText('der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })

  it('should show word again when answered wrong', () => {
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
    fireEvent(getByText('das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(4)
    fireEvent(getByText('das'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))

    expect(getAllByText(/Spachtel/)).toHaveLength(4)
  })

  it('should save progress correctly', async () => {
    const { getByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    fireEvent(getByText('der'), 'pressOut')
    fireEvent.press(getByText(labels.exercises.next))
    fireEvent(getByText('das'), 'pressOut')

    await act(async () => {
      await fireEvent.press(getByText(labels.exercises.showResults))
    })
    expect(saveExerciseProgress).toHaveBeenCalledWith(1, ExerciseKeys.articleChoiceExercise, [
      { document: documents[0], result: SIMPLE_RESULTS.correct, numberOfTries: 1 },
      { document: documents[1], result: SIMPLE_RESULTS.correct, numberOfTries: 1 }
    ])
  })

  it('should not show cheat buttons in normal mode', async () => {
    const { queryByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    expect(queryByText(labels.exercises.cheat.succeed)).toBeNull()
    expect(queryByText(labels.exercises.cheat.fail)).toBeNull()
  })

  it('should show cheat buttons in dev mode', async () => {
    const { queryByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    expect(queryByText(labels.exercises.cheat.succeed)).not.toBeNull()
    expect(queryByText(labels.exercises.cheat.fail)).not.toBeNull()
  })
})
