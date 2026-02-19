import { RouteProp } from '@react-navigation/native'
import { fireEvent, within } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { View } from 'react-native'

import { BottomSheetProps } from '../../../components/BottomSheet'
import { MAX_TRAINING_REPETITIONS } from '../../../constants/data'
import { StandardVocabularyItem } from '../../../models/VocabularyItem'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme from '../../../testing/render'
import SentenceTrainingScreen, { MAX_ATTEMPTS_PER_SENTENCE } from '../SentenceTrainingScreen'
import { initializeState, isSameWord, Sentence, stateReducer } from '../sentence/State'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
  shuffleIndexes: jest.fn(it => [...it.keys()]),
}))
jest.mock('../../../services/CmsApi')

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

// The bottom sheet is difficult to test due to its animations
jest.mock(
  '../../../components/BottomSheet',
  () =>
    ({ visible, children }: BottomSheetProps) =>
      visible ? <View>{children}</View> : null,
)

describe('SentenceTrainingScreen', () => {
  const vocabularyItems: StandardVocabularyItem[] = new VocabularyItemBuilder(MAX_TRAINING_REPETITIONS)
    .build()
    .map((item, index) => ({
      exampleSentence: { sentence: `Example sentence ${index}`, audio: `path/to/audio/${index}` },
      ...item,
    }))
  const sentences = vocabularyItems.map(({ exampleSentence, id, images }) => ({
    sentence: exampleSentence!.sentence,
    audio: exampleSentence!.audio,
    words: ['Example', 'sentence', `${id.id}`],
    id,
    image: images[0],
  }))
  const navigation = createNavigationMock<'SentenceTraining'>()
  const route: RouteProp<RoutesParams, 'SentenceTraining'> = {
    key: '',
    name: 'SentenceTraining',
    params: {
      job: {
        id: { type: 'standard', id: 0 },
        name: 'Test job',
        icon: 'icon',
        numberOfUnits: vocabularyItems.length,
        migrated: false,
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mocked(getWordsByJob).mockReturnValue(Promise.resolve(vocabularyItems))
  })

  const renderScreen = () => renderWithTheme(<SentenceTrainingScreen navigation={navigation} route={route} />)

  const renderScreenAndWaitForLoad = async () => {
    const renderApi = renderScreen()
    const availableWords = within(await renderApi.findByTestId('available-words'))
    const selectedWords = within(renderApi.getByTestId('selected-words'))
    return { ...renderApi, availableWords, selectedWords }
  }

  it('should render initially', async () => {
    const { availableWords, findByText } = await renderScreenAndWaitForLoad()

    expect(availableWords.getByText('Example')).toBeVisible()

    const button = await findByText(getLabels().exercises.skip)
    expect(button).toBeVisible()
  })

  it('should select and unselect words', async () => {
    const { availableWords, selectedWords } = await renderScreenAndWaitForLoad()

    fireEvent.press(availableWords.getByText('Example'))
    expect(availableWords.getByText('Example')).toBeDisabled()
    fireEvent.press(selectedWords.getByText('Example'))
    expect(availableWords.getByText('Example')).toBeEnabled()
  })

  it('should show correct feedback when words are in right order', async () => {
    const { availableWords, getByText } = await renderScreenAndWaitForLoad()

    // Select words in the correct order
    fireEvent.press(availableWords.getByText('Example'))
    fireEvent.press(availableWords.getByText('sentence'))
    fireEvent.press(availableWords.getByText('0'))

    // BottomSheet should show the correct message
    expect(getByText(getLabels().exercises.training.sentence.correct)).toBeVisible()
    expect(getByText(getLabels().exercises.continue)).toBeVisible()
  })

  it('should show incorrect feedback when words are in wrong order', async () => {
    const { availableWords, getByText } = await renderScreenAndWaitForLoad()

    // Select words in the wrong order
    fireEvent.press(availableWords.getByText('sentence'))
    fireEvent.press(availableWords.getByText('Example'))
    fireEvent.press(availableWords.getByText('0'))

    // BottomSheet should show the incorrect message
    expect(getByText(getLabels().exercises.training.sentence.incorrect)).toBeVisible()
    expect(getByText(getLabels().exercises.tryAgain)).toBeVisible()
  })

  it('should allow retry after incorrect answer', async () => {
    const { availableWords, getByText } = await renderScreenAndWaitForLoad()

    // Select words in the wrong order
    fireEvent.press(availableWords.getByText('sentence'))
    fireEvent.press(availableWords.getByText('Example'))
    fireEvent.press(availableWords.getByText('0'))

    fireEvent.press(getByText(getLabels().exercises.tryAgain))

    // Same sentence's words should be available again
    expect(availableWords.getByText('Example')).toBeEnabled()
    expect(availableWords.getByText('sentence')).toBeEnabled()
    expect(availableWords.getByText('0')).toBeEnabled()
  })

  it('should advance to next sentence after correct answer', async () => {
    const { availableWords, getByText } = await renderScreenAndWaitForLoad()

    // Select words in the correct order
    fireEvent.press(availableWords.getByText('Example'))
    fireEvent.press(availableWords.getByText('sentence'))
    fireEvent.press(availableWords.getByText('0'))

    fireEvent.press(getByText(getLabels().exercises.continue))

    expect(availableWords.getByText('1')).toBeEnabled()
  })

  it('should skip to next sentence', async () => {
    const { availableWords, getByText } = await renderScreenAndWaitForLoad()

    fireEvent.press(getByText(getLabels().exercises.skip))

    expect(availableWords.getByText('1')).toBeEnabled()
  })

  it('should navigate to TrainingFinished after last sentence', async () => {
    const { getByText } = await renderScreenAndWaitForLoad()

    for (let i = 0; i < MAX_TRAINING_REPETITIONS; i += 1) {
      expect(navigation.replace).not.toHaveBeenCalled()
      fireEvent.press(getByText(getLabels().exercises.skip))
    }

    expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', expect.any(Object))
  })

  it('should show continue instead of try again after max attempts', async () => {
    const { availableWords, getByText, queryByText } = await renderScreenAndWaitForLoad()

    // Make incorrect attempts until max is reached
    for (let attempt = 1; attempt < MAX_ATTEMPTS_PER_SENTENCE; attempt += 1) {
      fireEvent.press(availableWords.getByText('sentence'))
      fireEvent.press(availableWords.getByText('Example'))
      fireEvent.press(availableWords.getByText('0'))

      fireEvent.press(getByText(getLabels().exercises.tryAgain))
    }

    fireEvent.press(availableWords.getByText('sentence'))
    fireEvent.press(availableWords.getByText('Example'))
    fireEvent.press(availableWords.getByText('0'))

    // After max attempts, should show "Weiter" instead of "Nochmal versuchen"
    expect(getByText(getLabels().exercises.continue)).toBeVisible()
    expect(queryByText(getLabels().exercises.tryAgain)).not.toBeVisible()
  })

  it('should update the state correctly', () => {
    let state = initializeState(sentences.slice())
    expect(state.sentences).toHaveLength(MAX_TRAINING_REPETITIONS)

    for (let i = 0; i < MAX_TRAINING_REPETITIONS; i += 1) {
      expect(state.currentSentenceIndex).toBe(i)
      expect(state.randomizedWordIndexes).toEqual([0, 1, 2])
      expect(state.selectedWordIndexes).toEqual([])
      expect(state.attemptsForCurrentSentence).toBe(0)
      expect(state.correctAnswersCount).toBe(0)
      expect(state.allSentencesFinished).toBe(false)

      state = stateReducer(state, { type: 'nextSentence', wasAnswerCorrect: false })
    }

    expect(state.allSentencesFinished).toBe(true)
  })

  it('should count correct answers', () => {
    let state = initializeState(sentences.slice())
    expect(state.correctAnswersCount).toBe(0)

    state = stateReducer(state, { type: 'nextSentence', wasAnswerCorrect: true })
    expect(state.correctAnswersCount).toBe(1)

    state = stateReducer(state, { type: 'nextSentence', wasAnswerCorrect: false })
    expect(state.correctAnswersCount).toBe(1)
  })

  it('should compare by words, not indexes', () => {
    const sentence: Sentence[] = [
      {
        sentence: 'a a b',
        audio: '',
        words: ['a', 'a', 'b'],
        id: { type: 'lunes-standard', id: 0 },
        image: '',
      },
    ]
    const state = initializeState(sentence)
    expect(isSameWord(state, 0, 0)).toBe(true)
    expect(isSameWord(state, 0, 1)).toBe(true)
    expect(isSameWord(state, 0, 2)).toBe(false)
    expect(isSameWord(state, 1, 0)).toBe(true)
    expect(isSameWord(state, 1, 2)).toBe(false)
  })
})
