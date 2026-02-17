import { MAX_TRAINING_REPETITIONS } from '../../../constants/data'
import { VocabularyItemId } from '../../../models/VocabularyItem'
import { shuffleArray, shuffleIndexes } from '../../../services/helpers'

export type Sentence = {
  id: VocabularyItemId
  image: string
  sentence: string
  words: string[]
  audio: string
}

export type State = {
  sentences: Sentence[]
  currentSentenceIndex: number
  // The indexes of the words in the current sentence that are randomly shuffled
  randomizedWordIndexes: number[]
  // The indexes of the words that the user has selected so far in the current sentence
  selectedWordIndexes: number[]
  // The number of attempts the user already had for the current sentence
  attemptsForCurrentSentence: number
  // The count of correct answers so far across all sentences
  correctAnswersCount: number
  // Whether the exercise has finished
  allSentencesFinished: boolean
}

export const isSameWord = (state: State, firstIndex: number, secondIndex: number): boolean => {
  const currentSentence = state.sentences[state.currentSentenceIndex]
  return currentSentence.words[firstIndex] === currentSentence.words[secondIndex]
}

/**
 * Converts a sentence into an array of words for the exercise
 * Punctuation like dots and exclamation marks are removed from the words
 * so that the exercise does not become too easy.
 * Also makes sure that double spaces do not get converted into an empty word,
 * because that has already happened in the CMS data.
 */
export const splitSentence = (sentence: string): string[] =>
  sentence
    .replace(/[.!?,;]/g, '')
    .split(' ')
    .filter(word => word.trim().length > 0)

export const initializeState = (sentences: Sentence[]): State => {
  const shuffled = shuffleArray(sentences).slice(0, MAX_TRAINING_REPETITIONS)
  const currentSentenceIndex = 0
  const sentence = shuffled[currentSentenceIndex]
  return {
    sentences: shuffled,
    currentSentenceIndex,
    randomizedWordIndexes: shuffleIndexes(sentence.words),
    selectedWordIndexes: [],
    attemptsForCurrentSentence: 0,
    correctAnswersCount: 0,
    allSentencesFinished: false,
  }
}

export type Action =
  | { type: 'selectWord'; index: number }
  | { type: 'unselectWord'; index: number }
  | { type: 'nextSentence'; wasAnswerCorrect: boolean }
  | { type: 'repeat' }

// eslint-disable-next-line consistent-return
export const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'selectWord': {
      if (state.selectedWordIndexes.includes(action.index)) {
        return state
      }
      return { ...state, selectedWordIndexes: [...state.selectedWordIndexes, action.index] }
    }
    case 'unselectWord': {
      const withoutIndex = state.selectedWordIndexes.filter(index => index !== action.index)
      return { ...state, selectedWordIndexes: withoutIndex }
    }
    case 'repeat': {
      const currentSentence = state.sentences[state.currentSentenceIndex]
      return {
        ...state,
        selectedWordIndexes: [],
        randomizedWordIndexes: shuffleIndexes(currentSentence.words),
        attemptsForCurrentSentence: state.attemptsForCurrentSentence + 1,
      }
    }
    case 'nextSentence': {
      const hasNextSentence = state.currentSentenceIndex + 1 < state.sentences.length
      const nextIndex = hasNextSentence ? state.currentSentenceIndex + 1 : state.currentSentenceIndex
      const sentence = state.sentences[nextIndex]
      const correctAnswersCount = action.wasAnswerCorrect ? state.correctAnswersCount + 1 : state.correctAnswersCount
      return {
        ...state,
        currentSentenceIndex: nextIndex,
        selectedWordIndexes: [],
        randomizedWordIndexes: shuffleIndexes(sentence.words),
        attemptsForCurrentSentence: 0,
        correctAnswersCount,
        allSentencesFinished: !hasNextSentence,
      }
    }
  }
}
