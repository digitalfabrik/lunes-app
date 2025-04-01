import { ARTICLES } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import {
  RepetitionService,
  daysToStayInASection,
  MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE,
  WordNodeCard,
} from '../RepetitionService'
import { newDefaultStorage } from '../Storage'
import { milliSecondsToHours } from '../helpers'

describe('RepetitionService', () => {
  const testVocabulary = new VocabularyItemBuilder(8).build()
  let testData: WordNodeCard[] = []

  const storage = newDefaultStorage()
  const repetitionService = new RepetitionService(storage.wordNodeCards)

  beforeEach(() => {
    storage.wordNodeCards.set([])

    testData = [
      {
        word: testVocabulary[0],
        section: 5,
        inThisSectionSince: RepetitionService.addDays(new Date(), -(daysToStayInASection[5] + daysToStayInASection[5])),
      },
      {
        word: testVocabulary[1],
        section: 5,
        inThisSectionSince: RepetitionService.addDays(
          new Date(),
          -(daysToStayInASection[5] + 2 * daysToStayInASection[5]),
        ),
      },
      {
        word: testVocabulary[2],
        section: 2,
        inThisSectionSince: RepetitionService.addDays(
          new Date(),
          -(daysToStayInASection[2] + daysToStayInASection[3] + 2),
        ),
      },
      {
        word: testVocabulary[3],
        section: 1,
        inThisSectionSince: RepetitionService.addDays(
          new Date(),
          -(daysToStayInASection[1] + 2 * daysToStayInASection[4]),
        ),
      },
      {
        word: testVocabulary[4],
        section: 5,
        inThisSectionSince: RepetitionService.addDays(new Date(), -(daysToStayInASection[5] + 1)),
      },
      {
        word: testVocabulary[5],
        section: 0,
        inThisSectionSince: new Date(),
      },
      {
        word: testVocabulary[6],
        section: 0,
        inThisSectionSince: new Date(),
      },
      {
        word: testVocabulary[7],
        section: 6,
        inThisSectionSince: new Date(),
      },
    ]
  })

  const compareWordCardLists = (expected: WordNodeCard[]) => {
    const result: WordNodeCard[] = repetitionService.wordNodeCardStorage.value
    expect(result).toHaveLength(expected.length)
    result.forEach((wordNodeCard: WordNodeCard, index: number) => {
      expect(wordNodeCard.word).toEqual(expected[index].word)
      expect(wordNodeCard.section).toEqual(expected[index].section)
      expect(milliSecondsToHours(wordNodeCard.inThisSectionSince.valueOf())).toBeCloseTo(
        milliSecondsToHours(expected[index].inThisSectionSince.valueOf()),
      )
    })
  }

  describe('getLongTermExerciseInfo', () => {
    it('should return empty array if nothing saved yet', async () => {
      expect(repetitionService.wordNodeCardStorage.value).toEqual([])
    })

    it('should return the correct values', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      expect(repetitionService.wordNodeCardStorage.value).toEqual(testData)
    })
  })

  describe('getNumberOfWordsNeedingRepetitionWithUpperBound', () => {
    it('should return zero, if nothing was saved yet', async () => {
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toBe(0)
    })

    it('should return zero, if everything was moved today and no words in zero category', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData.map((item: WordNodeCard) => ({
          ...item,
          section: item.section === 0 ? 1 : item.section,
          inThisSectionSince: new Date(),
        })),
      )
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toBe(0)
    })

    it('should return two, if everything was moved today and two words in zero category', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData.map((item: WordNodeCard) => ({
          ...item,
          inThisSectionSince: new Date(),
        })),
      )
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toBe(2)
    })

    it('should return eight, if everything was moved long time ago', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData.map((item: WordNodeCard) => ({
          ...item,
          inThisSectionSince: new Date(2000, 1),
        })),
      )
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toBe(8)
    })

    it('should return upper bound, if more than allowed would be returned', async () => {
      repetitionService.wordNodeCardStorage.set(
        new VocabularyItemBuilder(20).build().map(item => ({
          word: item,
          section: 0,
          inThisSectionSince: new Date(),
        })),
      )
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toEqual(
        MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE,
      )
    })

    it('should return four, if one word from section two and three words from section five need repetition', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData
          .map((item: WordNodeCard) => ({
            ...item,
            inThisSectionSince: [2, 5].includes(item.section)
              ? RepetitionService.addDays(new Date(), -daysToStayInASection[item.section])
              : new Date(),
          }))
          .filter(item => item.section !== 0),
      )
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toBe(4)
    })

    it('should return zero, if words from every category need repetition tomorrow', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData
          .map((item: WordNodeCard) => ({
            ...item,
            inThisSectionSince: [1, 2, 3, 4].includes(item.section)
              ? RepetitionService.addDays(new Date(), -daysToStayInASection[item.section] + 1)
              : new Date(),
          }))
          .filter(item => item.section !== 0),
      )
      expect(repetitionService.getNumberOfWordsNeedingRepetitionWithUpperBound()).toBe(0)
    })
  })

  describe('getNeedsRepetitionScore', () => {
    it('should return 0, if the word needs repetition since today', () => {
      const word1: WordNodeCard = {
        word: testData[0].word,
        section: 0,
        inThisSectionSince: new Date(),
      }
      expect(RepetitionService.getNeedsRepetitionScore(word1)).toBe(0)

      const word2: WordNodeCard = {
        word: testData[0].word,
        section: 4,
        inThisSectionSince: RepetitionService.addDays(new Date(), -daysToStayInASection[4]),
      }
      expect(RepetitionService.getNeedsRepetitionScore(word2)).toBe(0)
    })

    it('should return 1, if 100% more days have passed, since the repetition was needed', () => {
      const wordWithSecondLowestScore: WordNodeCard = {
        word: testData[0].word,
        section: 5,
        inThisSectionSince: RepetitionService.addDays(new Date(), -(daysToStayInASection[5] + daysToStayInASection[5])),
      }
      expect(RepetitionService.getNeedsRepetitionScore(wordWithSecondLowestScore)).toBe(1)
    })

    it('should return 2, if 200% more days have passed, since the repetition was needed', () => {
      const word1: WordNodeCard = {
        word: testData[0].word,
        section: 5,
        inThisSectionSince: RepetitionService.addDays(
          new Date(),
          -(daysToStayInASection[5] + 2 * daysToStayInASection[5]),
        ),
      }
      expect(RepetitionService.getNeedsRepetitionScore(word1)).toBe(2)

      const word2: WordNodeCard = {
        word: testData[0].word,
        section: 4,
        inThisSectionSince: RepetitionService.addDays(
          new Date(),
          -(daysToStayInASection[4] + 2 * daysToStayInASection[4]),
        ),
      }
      expect(RepetitionService.getNeedsRepetitionScore(word2)).toBe(2)
    })

    it('should return negative number, if word needs no repetition yet', () => {
      const word: WordNodeCard = {
        word: testData[0].word,
        section: 4,
        inThisSectionSince: new Date(),
      }
      expect(RepetitionService.getNeedsRepetitionScore(word)).toBeLessThan(0)
    })
  })

  describe('getWordsForNextRepetition', () => {
    it('should return empty array, if nothing was saved yet', async () => {
      expect(repetitionService.getWordNodeCardsForNextRepetition()).toEqual([])
    })

    it('should return all words, if they need repetition and are fewer than upper bound', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData.map((item: WordNodeCard) => ({
          ...item,
          inThisSectionSince: new Date(2000, 1),
        })),
      )
      expect(repetitionService.getWordNodeCardsForNextRepetition()).toEqual(
        testData.map((item: WordNodeCard) => ({
          ...item,
          inThisSectionSince: new Date(2000, 1),
        })),
      )
    })

    it('should return nothing, if nothing needs repetition', async () => {
      repetitionService.wordNodeCardStorage.set(
        testData.map((item: WordNodeCard) => ({
          ...item,
          section: item.section === 0 ? 1 : item.section,
          inThisSectionSince: new Date(),
        })),
      )
      expect(repetitionService.getWordNodeCardsForNextRepetition()).toHaveLength(0)
    })

    it('should return words with higher scores, if there are more words to repeat than upper bound', async () => {
      const testData2: WordNodeCard[] = new VocabularyItemBuilder(15).build().map(item => ({
        word: item,
        section: 5,
        inThisSectionSince: RepetitionService.addDays(new Date(), -(daysToStayInASection[5] + daysToStayInASection[5])),
      }))
      expect(RepetitionService.getNeedsRepetitionScore(testData2[0])).toBe(1)

      expect(RepetitionService.getNeedsRepetitionScore(testData[0])).toBe(1)
      expect(RepetitionService.getNeedsRepetitionScore(testData[1])).toBe(2)
      expect(RepetitionService.getNeedsRepetitionScore(testData[2])).toBe(3)
      expect(RepetitionService.getNeedsRepetitionScore(testData[3])).toBe(daysToStayInASection[4] * 2)
      expect(RepetitionService.getNeedsRepetitionScore(testData[4])).toBe(0)
      testData.push(...testData2)

      repetitionService.wordNodeCardStorage.set(testData)
      const words = repetitionService.getWordNodeCardsForNextRepetition()
      expect(words).toHaveLength(MAX_WORD_NODE_CARDS_FOR_ONE_EXERCISE)
      expect(words).toContainEqual(testData[0])
      expect(words).toContainEqual(testData[1])
      expect(words).toContainEqual(testData[2])
      expect(words).toContainEqual(testData[3])
      expect(words).not.toContainEqual(testData[4])
    })
  })

  describe('getNumberOfWordsInEachSection', () => {
    it('should return zero array, if nothing was saved yet', async () => {
      expect(repetitionService.getNumberOfWordsInEachSection()).toEqual([0, 0, 0, 0, 0, 0, 0])
    })

    it('should return correct number of words for each section', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      expect(repetitionService.getNumberOfWordsInEachSection()).toEqual([2, 1, 1, 0, 0, 3, 1])
    })
  })

  describe('Update long term exercise data', () => {
    it('should add a new word to the first section, if nothing was saved yet', async () => {
      repetitionService.addWordToFirstSection(testData[0].word)
      compareWordCardLists([
        {
          word: testData[0].word,
          section: 0,
          inThisSectionSince: new Date(),
        },
      ])
    })

    it('should not add a word to the first section, if it is already in the long term exercise data', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      repetitionService.addWordToFirstSection(testData[0].word)
      compareWordCardLists(testData)
    })

    it('should add a new word to the first section', async () => {
      repetitionService.wordNodeCardStorage.set(testData.slice(0, 2))
      repetitionService.addWordToFirstSection(testData[2].word)
      compareWordCardLists(
        testData.slice(0, 2).concat([
          {
            word: testData[2].word,
            section: 0,
            inThisSectionSince: new Date(),
          },
        ]),
      )
    })

    it('should move one word to first section and second word not, if first word is new and second word already in data', async () => {
      repetitionService.wordNodeCardStorage.set(testData.slice(0, 3))
      repetitionService.addWordsToFirstSection(testData.slice(2, 4).map(item => item.word))
      compareWordCardLists(
        testData.slice(0, 3).concat([
          {
            word: testData[3].word,
            section: 0,
            inThisSectionSince: new Date(),
          },
        ]),
      )
    })

    it('should not move to next section, if word is not in long term exercise data', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      const notInLongTermExerciseWord: VocabularyItem = {
        id: 99,
        word: 'i am unknown',
        article: ARTICLES[1],
        type: 'st',
        audio: '',
        images: [],
        alternatives: [],
      }
      repetitionService.moveWordToNextSection(notInLongTermExerciseWord)
      compareWordCardLists(testData)
    })

    it('should move second word to next section if not in last section', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      repetitionService.moveWordToNextSection(testData[2].word)
      testData[2] = {
        ...testData[2],
        section: 3,
        inThisSectionSince: new Date(),
      }
      compareWordCardLists(testData)
    })

    it('should not move second word to next section if in last section', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      repetitionService.moveWordToNextSection(testData[7].word)
      testData[7] = {
        ...testData[7],
        inThisSectionSince: new Date(),
      }
      compareWordCardLists(testData)
    })

    it('should move second word to previous section if not in first section', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      repetitionService.moveWordToPreviousSection(testData[2].word)
      testData[2] = {
        ...testData[2],
        section: 1,
        inThisSectionSince: new Date(),
      }
      compareWordCardLists(testData)
    })

    it('should move second word to previous section if in first section', async () => {
      repetitionService.wordNodeCardStorage.set(testData)
      repetitionService.moveWordToPreviousSection(testData[5].word)
      testData[5] = {
        ...testData[5],
        inThisSectionSince: new Date(),
      }
      compareWordCardLists(testData)
    })
  })
})
