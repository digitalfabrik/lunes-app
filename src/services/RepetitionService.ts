import { VocabularyItem } from '../constants/endpoints'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { StorageField } from './Storage'
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
  readonly wordNodeCardStorage: StorageField<WordNodeCard[]>

  constructor(wordNodeCardStorage: StorageField<WordNodeCard[]>) {
    this.wordNodeCardStorage = wordNodeCardStorage
  }

  public getWordNodeCard = (word: VocabularyItem): WordNodeCard | undefined =>
    this.wordNodeCardStorage.value.find(wordNodeCard => wordNodeCard.word === word)

  public static addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  public static wordNodeCardNeedsRepetition = (wordNodeCard: WordNodeCard): boolean =>
    this.addDays(wordNodeCard.inThisSectionSince, daysToStayInASection[wordNodeCard.section]) <= new Date() ||
    wordNodeCard.section === 0

  public getNumberOfWordsNeedingRepetition = (): number =>
    this.wordNodeCardStorage.value.filter(item => RepetitionService.wordNodeCardNeedsRepetition(item)).length

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
    const wordsToRepeat = this.wordNodeCardStorage.value.filter(item =>
      RepetitionService.wordNodeCardNeedsRepetition(item),
    )
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
    this.wordNodeCardStorage.value.map(wordNodeCard => ({
      vocabularyItem: wordNodeCard.word,
      result: null,
      numberOfTries: 0,
    }))

  public getNumberOfWordsInEachSection = (): number[] => {
    const result = Array(sections.length).fill(0)
    this.wordNodeCardStorage.value.forEach(item => {
      result[item.section] += 1
    })
    return result
  }

  public addWordsToFirstSection = async (words: VocabularyItem[]): Promise<void> => {
    const newWordCards = this.wordNodeCardStorage.value.slice()
    words.forEach(word => {
      if (
        this.wordNodeCardStorage.value.filter(item => JSON.stringify(item.word) === JSON.stringify(word)).length === 0
      ) {
        newWordCards.push({
          word,
          section: 0,
          inThisSectionSince: new Date(),
        })
      }
    })
    return this.wordNodeCardStorage.set(newWordCards)
  }

  public addWordToFirstSection = async (word: VocabularyItem): Promise<void> => this.addWordsToFirstSection([word])

  private static getSectionWithBoundCheck = (section: number) =>
    sections[Math.min(Math.max(0, section), sections.length - 1)]

  private moveWordToSection = async (word: VocabularyItem, offset: 1 | -1): Promise<void> => {
    const wordNodeCards = this.wordNodeCardStorage.value.slice()
    const wordNodeCard = wordNodeCards.find(wordNodeCard => JSON.stringify(wordNodeCard.word) === JSON.stringify(word))
    if (wordNodeCard) {
      const targetSection = wordNodeCard.section + offset
      wordNodeCard.section = RepetitionService.getSectionWithBoundCheck(targetSection)
      wordNodeCard.inThisSectionSince = new Date()
      await this.wordNodeCardStorage.set(wordNodeCards)
    }
  }

  public moveWordToNextSection = async (word: VocabularyItem): Promise<void> => this.moveWordToSection(word, 1)

  public moveWordToPreviousSection = async (word: VocabularyItem): Promise<void> => this.moveWordToSection(word, -1)

  public updateWordNodeCard = async (wordWithResult: VocabularyItemResult): Promise<void> =>
    this.moveWordToSection(wordWithResult.vocabularyItem, wordWithResult.result === 'correct' ? 1 : -1)
}
