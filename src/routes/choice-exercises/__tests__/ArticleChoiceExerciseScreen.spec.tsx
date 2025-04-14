import { CommonActions, RouteProp } from '@react-navigation/native'
import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { ExerciseKeys, SIMPLE_RESULTS } from '../../../constants/data'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import { saveExerciseProgress } from '../../../services/storageUtils'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render, { renderWithStorageCache } from '../../../testing/render'
import ArticleChoiceExerciseScreen from '../ArticleChoiceExerciseScreen'

jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))

jest.mock('../../../services/storageUtils', () => ({
  getExerciseProgress: jest.fn(() => ({})),
  saveExerciseProgress: jest.fn(),
  getDevMode: jest.fn(async () => false),
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('../../../components/CheatMode', () => {
  const Text = require('react-native').Text
  return () => <Text>CheatMode</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')
jest.useFakeTimers()

describe('ArticleChoiceExerciseScreen', () => {
  let storageCache: StorageCache

  beforeEach(() => {
    jest.clearAllMocks()
    storageCache = StorageCache.createForTesting()
  })

  const vocabularyItems = new VocabularyItemBuilder(2).build()
  const navigation = createNavigationMock<'ArticleChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'ArticleChoiceExercise'> = {
    key: '',
    name: 'ArticleChoiceExercise',
    params: {
      contentType: 'standard',
      vocabularyItems,
      disciplineId: 1,
      disciplineTitle: 'TestTitel',
      closeExerciseAction: CommonActions.goBack(),
    },
  }

  it('should allow to skip an exercise and try it out later', () => {
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)
    expect(getAllByText(/Spachtel/)).toHaveLength(3)
    const tryLater = getByText(getLabels().exercises.tryLater)
    fireEvent.press(tryLater)

    expect(getAllByText(/Auto/)).toHaveLength(3)
    fireEvent(getByText('der'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(getAllByText(/Spachtel/)).toHaveLength(3)
  })

  it('should not allow to skip last vocabularyItem', () => {
    const { queryByText, getByText, getAllByText } = render(
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />,
    )

    expect(getAllByText(/Spachtel/)).toHaveLength(3)
    fireEvent(getByText('der'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(3)
    expect(queryByText(getLabels().exercises.tryLater)).toBeNull()
  })

  it('should show word again when answered wrong', () => {
    const { getByText, getAllByText } = render(<ArticleChoiceExerciseScreen route={route} navigation={navigation} />)

    expect(getAllByText(/Spachtel/)).toHaveLength(3)
    fireEvent(getByText('das'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(getAllByText(/Auto/)).toHaveLength(3)
    fireEvent(getByText('das'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(getAllByText(/Spachtel/)).toHaveLength(3)
  })

  it('should save progress correctly', async () => {
    const { getByText } = renderWithStorageCache(
      storageCache,
      <ArticleChoiceExerciseScreen route={route} navigation={navigation} />,
    )

    fireEvent(getByText('der'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('das'), 'pressOut')

    await act(async () => {
      fireEvent.press(getByText(getLabels().exercises.showResults))
    })
    expect(saveExerciseProgress).toHaveBeenCalledWith(storageCache, 1, ExerciseKeys.articleChoiceExercise, [
      { vocabularyItem: vocabularyItems[0], result: SIMPLE_RESULTS.correct, numberOfTries: 1 },
      { vocabularyItem: vocabularyItems[1], result: SIMPLE_RESULTS.correct, numberOfTries: 1 },
    ])
  })
})
