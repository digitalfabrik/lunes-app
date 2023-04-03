import AsyncStorage from '@react-native-async-storage/async-storage'

import { VocabularyItem } from '../constants/endpoints'
import { millisecondsToDays } from './helpers'

/* eslint-disable no-magic-numbers */
type sections = 0 | 1 | 2 | 3 | 4 | 5 | 6
export const sections: sections[] = [0, 1, 2, 3, 4, 5, 6]

type daysToStayInASection = 0 | 1 | 3 | 7 | 30 | 90 | 1000
export const daysToStayInASection: daysToStayInASection[] = [0, 1, 3, 7, 30, 90, 1000]
/* eslint-enable no-magic-numbers */

export type WordNodeCard = {
  word: VocabularyItem
  section: sections
  inThisSectionSince: Date
}

const WORD_NODE_CARDS_STORAGE_KEY = 'wordNodeCards'
export const MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE = 15

export const getWordNodeCards = async (): Promise<WordNodeCard[]> => {
  const data = await AsyncStorage.getItem(WORD_NODE_CARDS_STORAGE_KEY)
  return data
    ? JSON.parse(data).map((item: WordNodeCard) => ({
        ...item,
        inThisSectionSince: new Date(item.inThisSectionSince),
      }))
    : []
}

export const saveWordNodeCards = (wordNodeCards: WordNodeCard[]): Promise<void> =>
  AsyncStorage.setItem(WORD_NODE_CARDS_STORAGE_KEY, JSON.stringify(wordNodeCards))

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

const wordNodeCardNeedsRepetition = (wordNodeCard: WordNodeCard): boolean =>
  addDays(wordNodeCard.inThisSectionSince, daysToStayInASection[wordNodeCard.section]) <= new Date() ||
  wordNodeCard.section === 0

const getNumberOfWordNodeCardsNeedingRepetition = (): Promise<number> =>
  getWordNodeCards().then(info => info.filter(item => wordNodeCardNeedsRepetition(item)).length)

export const getNumberOfWordNodeCardsNeedingRepetitionWithUpperBound = async (): Promise<number> =>
  Math.min(await getNumberOfWordNodeCardsNeedingRepetition(), MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE)

export const getNeedsRepetitionScore = (wordNodeCard: WordNodeCard): number => {
  const daysSinceRepetitionIsNeeded = millisecondsToDays(
    new Date().valueOf() -
      addDays(wordNodeCard.inThisSectionSince, daysToStayInASection[wordNodeCard.section]).valueOf()
  )
  const daysToStayInThisSectionWithDivideByZeroProtection = Math.max(daysToStayInASection[wordNodeCard.section], 1)
  return Math.round(daysSinceRepetitionIsNeeded / daysToStayInThisSectionWithDivideByZeroProtection)
}

export const getWordsForNextRepetition = (): Promise<WordNodeCard[]> =>
  getWordNodeCards().then(info => {
    const wordsToRepeat = info.filter(item => wordNodeCardNeedsRepetition(item))
    if (wordsToRepeat.length <= MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE) {
      return wordsToRepeat
    }
    return wordsToRepeat
      .map(item => ({
        ...item,
        needsRepetitionScore: getNeedsRepetitionScore(item),
      }))
      .sort((word1, word2) => word2.needsRepetitionScore - word1.needsRepetitionScore)
      .slice(0, MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE)
      .map(({ needsRepetitionScore, ...rest }) => rest)
  })

export const getNumberOfWordsInEachSection = async (): Promise<number[]> => {
  const result = Array(sections.length).fill(0)
  await getWordNodeCards().then(wordNodeCards =>
    wordNodeCards.forEach(item => {
      result[item.section] += 1
    })
  )
  return result
}

export const addWordsToFirstSection = async (words: VocabularyItem[]): Promise<void> => {
  const wordNodeCards: WordNodeCard[] = await getWordNodeCards()
  words.forEach(word => {
    if (wordNodeCards.filter(item => JSON.stringify(item.word) === JSON.stringify(word)).length === 0) {
      wordNodeCards.push({
        word,
        section: 0,
        inThisSectionSince: new Date(),
      })
    }
  })
  return saveWordNodeCards(wordNodeCards)
}

export const addWordToFirstSection = async (word: VocabularyItem): Promise<void> => addWordsToFirstSection([word])

const getSectionWithBoundCheck = (section: number) => sections[Math.min(Math.max(0, section), sections.length - 1)]

const moveWordToSection = async (wordNodeCard: WordNodeCard, targetSection: number): Promise<void> => {
  const wordNodeCards: WordNodeCard[] = await getWordNodeCards()
  const wordNodeCardToMove = wordNodeCards.find(item => JSON.stringify(item) === JSON.stringify(wordNodeCard))
  if (wordNodeCardToMove) {
    wordNodeCardToMove.section = getSectionWithBoundCheck(targetSection)
    wordNodeCardToMove.inThisSectionSince = new Date()
    await saveWordNodeCards(wordNodeCards)
  }
}

export const moveWordToNextSection = async (wordNodeCard: WordNodeCard): Promise<void> =>
  moveWordToSection(wordNodeCard, wordNodeCard.section + 1)

export const moveWordToPreviousSection = async (wordNodeCard: WordNodeCard): Promise<void> =>
  moveWordToSection(wordNodeCard, wordNodeCard.section - 1)
