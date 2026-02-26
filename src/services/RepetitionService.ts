import VocabularyItem, { areVocabularyItemIdsEqual } from '../models/VocabularyItem'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import NotificationService from './NotificationService'
import { StorageCache } from './Storage'
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
  public readonly getWordNodeCards: () => readonly WordNodeCard[]
  private readonly setWordNodeCardsWithoutReminder: (cards: WordNodeCard[]) => Promise<void>

  constructor(
    getWordNodeCards: () => readonly WordNodeCard[],
    setWordNodeCardsWithoutReminder: (cards: WordNodeCard[]) => Promise<void>,
  ) {
    this.getWordNodeCards = getWordNodeCards
    this.setWordNodeCardsWithoutReminder = setWordNodeCardsWithoutReminder
  }

  public static fromStorageCache = (storageCache: StorageCache): RepetitionService =>
    new RepetitionService(
      () => storageCache.getItem('wordNodeCards'),
      value => storageCache.setItem('wordNodeCards', value),
    )

  public getWordNodeCard = (word: VocabularyItem): WordNodeCard | undefined =>
    this.getWordNodeCards().find(wordNodeCard => wordNodeCard.word === word)

  public removeWordNodeCard = async (word: VocabularyItem): Promise<void> => {
    const newWordNodeCards = this.getWordNodeCards().filter(
      wordNodeCard => !areVocabularyItemIdsEqual(wordNodeCard.word.id, word.id),
    )
    await this.setWordNodeCards(newWordNodeCards)
  }

  private static updateRepetitionReminder = async (cards: WordNodeCard[]): Promise<void> => {
    const nextRepetitionDate = RepetitionService.getNextRepetitionDate(cards)
    if (nextRepetitionDate !== null && nextRepetitionDate > new Date()) {
      await NotificationService.scheduleRepetitionReminder(nextRepetitionDate)
    } else {
      await NotificationService.clearRepetitionReminder()
    }
  }

  public setWordNodeCards = async (cards: WordNodeCard[]): Promise<void> => {
    await RepetitionService.updateRepetitionReminder(cards)
    await this.setWordNodeCardsWithoutReminder(cards)
  }

  public static addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  public static wordNodeCardDateOfNextRepetition = (card: WordNodeCard): Date =>
    this.addDays(card.inThisSectionSince, daysToStayInASection[card.section])

  public static getNextRepetitionDate = (cards: WordNodeCard[]): Date | null => {
    let nextDate: Date | null = null

    cards.forEach(card => {
      const nextRepetitionOfCard = RepetitionService.wordNodeCardDateOfNextRepetition(card)
      if (nextDate === null || nextDate > nextRepetitionOfCard) {
        nextDate = nextRepetitionOfCard
      }
    })

    return nextDate
  }

  public static wordNodeCardNeedsRepetition = (wordNodeCard: WordNodeCard): boolean =>
    this.wordNodeCardDateOfNextRepetition(wordNodeCard) <= new Date()

  public getNumberOfWordsNeedingRepetition = (): number =>
    this.getWordNodeCards().filter(item => RepetitionService.wordNodeCardNeedsRepetition(item)).length

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
    const wordsToRepeat = this.getWordNodeCards().filter(item => RepetitionService.wordNodeCardNeedsRepetition(item))
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
    this.getWordNodeCards().map(wordNodeCard => ({
      vocabularyItem: wordNodeCard.word,
      result: null,
      numberOfTries: 0,
    }))

  public getNumberOfWordsInEachSection = (): number[] => {
    const result = Array(sections.length).fill(0)
    this.getWordNodeCards().forEach(item => {
      result[item.section] += 1
    })
    return result
  }

  public addWordsToFirstSection = async (words: VocabularyItem[]): Promise<void> => {
    const newWordCards = this.getWordNodeCards().slice()
    words.forEach(word => {
      const alreadyExistingCard = newWordCards.find(wordNodeCard =>
        areVocabularyItemIdsEqual(wordNodeCard.word.id, word.id),
      )
      if (alreadyExistingCard) {
        const resetCard = { ...alreadyExistingCard, section: sections[0], inThisSectionSince: new Date() }
        const index = newWordCards.indexOf(alreadyExistingCard)
        newWordCards[index] = resetCard
      } else {
        newWordCards.push({
          word,
          section: 0,
          inThisSectionSince: new Date(),
        })
      }
    })
    return this.setWordNodeCards(newWordCards)
  }

  public addWordToFirstSection = async (word: VocabularyItem): Promise<void> => this.addWordsToFirstSection([word])

  private static getSectionWithBoundCheck = (section: number) =>
    sections[Math.min(Math.max(0, section), sections.length - 1)]

  private static updateWord = (word: WordNodeCard, isCorrect: boolean): WordNodeCard => {
    const targetSection = isCorrect ? word.section + 1 : sections[0]
    return {
      ...word,
      section: RepetitionService.getSectionWithBoundCheck(targetSection),
      inThisSectionSince: new Date(),
    }
  }

  public updateSeveralWordNodeCards = async (wordsWithResult: VocabularyItemResult[]): Promise<void> => {
    const newWordCards = this.getWordNodeCards().slice()
    wordsWithResult.forEach(word => {
      const index = newWordCards.findIndex(wordCard =>
        areVocabularyItemIdsEqual(wordCard.word.id, word.vocabularyItem.id),
      )
      if (index !== -1) {
        newWordCards[index] = RepetitionService.updateWord(newWordCards[index], word.result === 'correct')
      }
    })
    return this.setWordNodeCards(newWordCards)
  }
}
