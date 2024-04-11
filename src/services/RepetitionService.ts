import AsyncStorage from '@react-native-async-storage/async-storage'

import { VocabularyItem } from '../constants/endpoints'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
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

export class RepetitionService {
  public static getWordNodeCards = async (): Promise<WordNodeCard[]> => {
    const data = await AsyncStorage.getItem(WORD_NODE_CARDS_STORAGE_KEY)
    return data
      ? JSON.parse(data).map((item: WordNodeCard) => ({
          ...item,
          inThisSectionSince: new Date(item.inThisSectionSince),
        }))
      : []
  }

  public static getWordNodeCard = (word: VocabularyItem, wordNodeCards: WordNodeCard[]): WordNodeCard | undefined =>
    wordNodeCards.find(wordNodeCard => wordNodeCard.word === word)

  public static saveWordNodeCards = (wordNodeCards: WordNodeCard[]): Promise<void> =>
    AsyncStorage.setItem(WORD_NODE_CARDS_STORAGE_KEY, JSON.stringify(wordNodeCards))

  public static addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  public static wordNodeCardNeedsRepetition = (wordNodeCard: WordNodeCard): boolean =>
    this.addDays(wordNodeCard.inThisSectionSince, daysToStayInASection[wordNodeCard.section]) <= new Date() ||
    wordNodeCard.section === 0

  public static getNumberOfWordsNeedingRepetition = (): Promise<number> =>
    this.getWordNodeCards().then(
      wordNodeCards => wordNodeCards.filter(item => this.wordNodeCardNeedsRepetition(item)).length,
    )

  public static getNumberOfWordsNeedingRepetitionWithUpperBound = async (): Promise<number> => {
    const numberOfWordNodeCardsNeedingRepetition: number = await this.getNumberOfWordsNeedingRepetition()
    return Math.min(numberOfWordNodeCardsNeedingRepetition, MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE)
  }

  public static getNeedsRepetitionScore = (wordNodeCard: WordNodeCard): number => {
    const daysSinceRepetitionIsNeeded = millisecondsToDays(
      new Date().valueOf() -
        this.addDays(wordNodeCard.inThisSectionSince, daysToStayInASection[wordNodeCard.section]).valueOf(),
    )
    const daysToStayInThisSectionWithDivideByZeroProtection = Math.max(daysToStayInASection[wordNodeCard.section], 1)
    return Math.round(daysSinceRepetitionIsNeeded / daysToStayInThisSectionWithDivideByZeroProtection)
  }

  public static getWordNodeCardsForNextRepetition = (): Promise<WordNodeCard[]> =>
    this.getWordNodeCards().then(info => {
      const wordsToRepeat = info.filter(item => this.wordNodeCardNeedsRepetition(item))
      if (wordsToRepeat.length <= MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE) {
        return wordsToRepeat
      }
      return wordsToRepeat
        .map(item => ({
          ...item,
          needsRepetitionScore: this.getNeedsRepetitionScore(item),
        }))
        .sort((word1, word2) => word2.needsRepetitionScore - word1.needsRepetitionScore)
        .slice(0, MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE)
        .map(({ needsRepetitionScore, ...rest }) => rest)
    })

  public static getVocabularyItemsWithResultsForNextRepetition = async (): Promise<VocabularyItemResult[]> => {
    const wordNodeCards = await this.getWordNodeCardsForNextRepetition()
    return wordNodeCards.map(wordNodeCard => ({
      vocabularyItem: wordNodeCard.word,
      result: null,
      numberOfTries: 0,
    }))
  }

  public static getNumberOfWordsInEachSection = async (): Promise<number[]> => {
    const result = Array(sections.length).fill(0)
    await this.getWordNodeCards().then(wordNodeCards =>
      wordNodeCards.forEach(item => {
        result[item.section] += 1
      }),
    )
    return result
  }

  public static addWordsToFirstSection = async (words: VocabularyItem[]): Promise<void> => {
    const wordNodeCards: WordNodeCard[] = await this.getWordNodeCards()
    words.forEach(word => {
      if (wordNodeCards.filter(item => JSON.stringify(item.word) === JSON.stringify(word)).length === 0) {
        wordNodeCards.push({
          word,
          section: 0,
          inThisSectionSince: new Date(),
        })
      }
    })
    return this.saveWordNodeCards(wordNodeCards)
  }

  public static addWordToFirstSection = async (word: VocabularyItem): Promise<void> =>
    this.addWordsToFirstSection([word])

  private static getSectionWithBoundCheck = (section: number) =>
    sections[Math.min(Math.max(0, section), sections.length - 1)]

  private static moveWordToSection = async (word: VocabularyItem, offset: 1 | -1): Promise<void> => {
    const wordNodeCards = await this.getWordNodeCards()
    const wordNodeCard = wordNodeCards.find(wordNodeCard => JSON.stringify(wordNodeCard.word) === JSON.stringify(word))
    if (wordNodeCard) {
      const targetSection = wordNodeCard.section + offset
      wordNodeCard.section = this.getSectionWithBoundCheck(targetSection)
      wordNodeCard.inThisSectionSince = new Date()
      await this.saveWordNodeCards(wordNodeCards)
    }
  }

  public static moveWordToNextSection = async (word: VocabularyItem): Promise<void> => this.moveWordToSection(word, 1)

  public static moveWordToPreviousSection = async (word: VocabularyItem): Promise<void> =>
    this.moveWordToSection(word, -1)

  public static updateWordNodeCard = async (wordWithResult: VocabularyItemResult): Promise<void> =>
    this.moveWordToSection(wordWithResult.vocabularyItem, wordWithResult.result === 'correct' ? 1 : -1)
}
