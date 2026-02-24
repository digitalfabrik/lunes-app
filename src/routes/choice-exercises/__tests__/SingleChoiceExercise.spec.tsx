import { CommonActions, RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../services/RepetitionService'
import { StorageCache } from '../../../services/Storage'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import ChoiceExerciseScreen from '../components/SingleChoiceExercise'

jest.mock('../../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../../components/CheatMode', () => {
  const Text = require('react-native').Text
  return () => <Text>CheatMode</Text>
})

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('react-native-image-zoom-viewer', () => {
  const Text = require('react-native').Text
  return () => <Text>ImageZoomViewer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('SingleChoiceExercise', () => {
  let vocabularyItems: ReturnType<VocabularyItemBuilder['build']>
  let navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
  let route: RouteProp<RoutesParams, 'WordChoiceExercise'>
  let storageCache: StorageCache
  let repetitionService: RepetitionService
  let vocabularyItem: (typeof vocabularyItems)[0]

  beforeEach(() => {
    vocabularyItems = new VocabularyItemBuilder(1).build()
    navigation = createNavigationMock<'WordChoiceExercise'>() as StackNavigationProp<RoutesParams, 'WordChoiceExercise'>
    route = {
      key: '',
      name: 'WordChoiceExercise',
      params: {
        contentType: 'standard',
        vocabularyItems,
        unitId: { id: 1, type: 'standard' },
        unitTitle: 'Test',
        closeExerciseAction: CommonActions.goBack(),
      },
    }

    storageCache = StorageCache.createDummy()
    repetitionService = RepetitionService.fromStorageCache(storageCache)
    vocabularyItem = vocabularyItems[0]
  })

  it('does not add a word when the answer was correct', async () => {
    const vocabularyItemToAnswer = () => [
      { word: vocabularyItem.word, article: vocabularyItem.article },
      { word: 'WRONG_ANSWER', article: { id: 0, value: 'keiner' } },
    ]

    const { getByText } = renderWithStorageCache(
      storageCache,
      <ChoiceExerciseScreen
        vocabularyItems={vocabularyItems}
        unitId={{ id: 1, type: 'standard' }}
        vocabularyItemToAnswer={vocabularyItemToAnswer}
        navigation={navigation}
        route={route}
        exerciseKey={1}
      />,
    )

    const correct = getByText(vocabularyItem.word)
    fireEvent(correct, 'pressOut')

    await waitFor(() => {
      const words = repetitionService.getWordNodeCards()
      expect(words).toHaveLength(0)
    })
  })

  it('adds incorrect words to the repetition service', async () => {
    const vocabularyItemToAnswerWrong = () => [
      { word: 'WRONG_ANSWER', article: { id: 0, value: 'keiner' } },
      { word: vocabularyItem.word, article: vocabularyItem.article },
    ]

    const { getByText } = renderWithStorageCache(
      storageCache,
      <ChoiceExerciseScreen
        vocabularyItems={vocabularyItems}
        unitId={{ id: 1, type: 'standard' }}
        vocabularyItemToAnswer={vocabularyItemToAnswerWrong}
        navigation={navigation}
        route={route}
        exerciseKey={1}
      />,
    )

    const wrong = getByText('WRONG_ANSWER')
    fireEvent(wrong, 'pressOut')

    await waitFor(() => {
      const words = repetitionService.getWordNodeCards()
      expect(words).toHaveLength(1)
    })
  })

  it('keeps a word added after an incorrect then later correct answer', async () => {
    const vocabularyItemToAnswerWrong = () => [
      { word: 'WRONG_ANSWER', article: { id: 0, value: 'keiner' } },
      { word: vocabularyItem.word, article: vocabularyItem.article },
    ]

    const { getByText, unmount } = renderWithStorageCache(
      storageCache,
      <ChoiceExerciseScreen
        vocabularyItems={vocabularyItems}
        unitId={{ id: 1, type: 'standard' }}
        vocabularyItemToAnswer={vocabularyItemToAnswerWrong}
        navigation={navigation}
        route={route}
        exerciseKey={1}
      />,
    )

    const wrong = getByText('WRONG_ANSWER')
    fireEvent(wrong, 'pressOut')

    await waitFor(() => {
      const words = repetitionService.getWordNodeCards()
      expect(words).toHaveLength(1)
    })

    unmount()

    const vocabularyItemToAnswerCorrect = () => [
      { word: vocabularyItem.word, article: vocabularyItem.article },
      { word: 'WRONG_ANSWER', article: { id: 0, value: 'keiner' } },
    ]

    const { getByText: getByText2 } = renderWithStorageCache(
      storageCache,
      <ChoiceExerciseScreen
        vocabularyItems={vocabularyItems}
        unitId={{ id: 1, type: 'standard' }}
        vocabularyItemToAnswer={vocabularyItemToAnswerCorrect}
        navigation={navigation}
        route={route}
        exerciseKey={1}
      />,
    )

    const correctNow = getByText2(vocabularyItem.word)
    fireEvent(correctNow, 'pressOut')

    await waitFor(() => {
      const wordsNow = repetitionService.getWordNodeCards()
      expect(wordsNow).toHaveLength(1)
    })
  })
})
