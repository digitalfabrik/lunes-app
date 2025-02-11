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

export const MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE = 15

export class RepetitionService {
  private readonly wordNodeCards: WordNodeCard[]
  private readonly setWordNodeCards: (wordNodeCards: WordNodeCard[]) => void

  constructor(wordNodeCards: WordNodeCard[], setWordNodeCards: (wordNodeCards: WordNodeCard[]) => void) {
    this.wordNodeCards = wordNodeCards
    this.setWordNodeCards = setWordNodeCards
  }

  public getWordNodeCard = (word: VocabularyItem): WordNodeCard | undefined =>
    this.wordNodeCards.find(wordNodeCard => wordNodeCard.word === word)

  public static addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  public static wordNodeCardNeedsRepetition = (wordNodeCard: WordNodeCard): boolean =>
    this.addDays(wordNodeCard.inThisSectionSince, daysToStayInASection[wordNodeCard.section]) <= new Date() ||
    wordNodeCard.section === 0

  public getNumberOfWordsNeedingRepetition = (): number =>
    this.wordNodeCards.filter(item => RepetitionService.wordNodeCardNeedsRepetition(item)).length

  public getNumberOfWordsNeedingRepetitionWithUpperBound = (): number => {
    const numberOfWordNodeCardsNeedingRepetition = this.getNumberOfWordsNeedingRepetition()
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

  public getWordNodeCardsForNextRepetition = (): WordNodeCard[] => {
    const wordsToRepeat = this.wordNodeCards.filter(item => RepetitionService.wordNodeCardNeedsRepetition(item))
    if (wordsToRepeat.length <= MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE) {
      return wordsToRepeat
    }
    return wordsToRepeat
      .map(item => ({
        ...item,
        needsRepetitionScore: RepetitionService.getNeedsRepetitionScore(item),
      }))
      .sort((word1, word2) => word2.needsRepetitionScore - word1.needsRepetitionScore)
      .slice(0, MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE)
      .map(({ needsRepetitionScore, ...rest }) => rest)
  }

  public getVocabularyItemsWithResultsForNextRepetition = (): VocabularyItemResult[] =>
    this.wordNodeCards.map(wordNodeCard => ({
      vocabularyItem: wordNodeCard.word,
      result: null,
      numberOfTries: 0,
    }))

  public getNumberOfWordsInEachSection = (): number[] => {
    const result = Array(sections.length).fill(0)
    this.wordNodeCards.forEach(item => {
      result[item.section] += 1
    })
    return result
  }

  public addWordsToFirstSection = (words: VocabularyItem[]): void => {
    const newWordCards = this.wordNodeCards.slice()
    words.forEach(word => {
      if (this.wordNodeCards.filter(item => JSON.stringify(item.word) === JSON.stringify(word)).length === 0) {
        newWordCards.push({
          word,
          section: 0,
          inThisSectionSince: new Date(),
        })
      }
    })
    return this.setWordNodeCards(newWordCards)
  }

  public addWordToFirstSection = (word: VocabularyItem): void => this.addWordsToFirstSection([word])

  private static getSectionWithBoundCheck = (section: number) =>
    sections[Math.min(Math.max(0, section), sections.length - 1)]

  private moveWordToSection = (word: VocabularyItem, offset: 1 | -1): void => {
    const wordNodeCards = this.wordNodeCards.slice()
    const wordNodeCard = wordNodeCards.find(wordNodeCard => JSON.stringify(wordNodeCard.word) === JSON.stringify(word))
    if (wordNodeCard) {
      const targetSection = wordNodeCard.section + offset
      wordNodeCard.section = RepetitionService.getSectionWithBoundCheck(targetSection)
      wordNodeCard.inThisSectionSince = new Date()
      this.setWordNodeCards(wordNodeCards)
    }
  }

  public moveWordToNextSection = (word: VocabularyItem): void => this.moveWordToSection(word, 1)

  public moveWordToPreviousSection = (word: VocabularyItem): void => this.moveWordToSection(word, -1)

  public updateWordNodeCard = (wordWithResult: VocabularyItemResult): void =>
    this.moveWordToSection(wordWithResult.vocabularyItem, wordWithResult.result === 'correct' ? 1 : -1)
}
