import { RouteProp } from '@react-navigation/native'
import { mocked } from 'jest-mock'
import React from 'react'

import { MAX_TRAINING_REPETITIONS } from '../../../constants/data'
import { StandardVocabularyItem } from '../../../models/VocabularyItem'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme from '../../../testing/render'
import SentenceTrainingScreen from '../SentenceTrainingScreen'
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

describe('SentenceTrainingScreen', () => {
  const vocabularyItems: StandardVocabularyItem[] = new VocabularyItemBuilder(8).build().map((item, index) => ({
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
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render initially', async () => {
    mocked(getWordsByJob).mockReturnValue(Promise.resolve(vocabularyItems))
    const { findAllByText, findByText } = renderWithTheme(<SentenceTrainingScreen navigation={navigation} route={route} />)

    await expect(findAllByText('Example')).resolves.toHaveLength(2)

    const button = await findByText(getLabels().exercises.skip)
    expect(button).toBeVisible()
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
