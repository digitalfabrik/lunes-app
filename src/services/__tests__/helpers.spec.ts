import {
  ARTICLES,
  NextExercise,
  SCORE_THRESHOLD_UNLOCK,
  SimpleResult,
  VOCABULARY_ITEM_TYPES,
} from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockJobs } from '../../testing/mockJob'
import mockUnits from '../../testing/mockUnit'
import { getJob, getUnitsOfJob } from '../CmsApi'
import { StorageCache } from '../Storage'
import {
  calculateScore,
  getNextExercise,
  getProgress,
  getSortedAndFilteredVocabularyItems,
  searchJobs,
  willNextExerciseUnlock,
} from '../helpers'

import mocked = jest.mocked

jest.mock('../CmsApi')
jest.mock('../storageUtils')

describe('helpers', () => {
  const profession = mockJobs()[0]
  const storageCache = StorageCache.createDummy()

  beforeEach(async () => {
    await storageCache.setItem('progress', {})
  })

  describe('getNextExercise', () => {
    const getNextExerciseWithCheck = async (): Promise<NextExercise> =>
      getNextExercise({ progress: storageCache.getItem('progress'), job: profession })

    beforeEach(() => {
      mocked(getUnitsOfJob).mockReturnValue(Promise.resolve(mockUnits))
    })

    it('should open first exercise, if no exercise was finished yet', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(0)
    })

    it('should open second exercise, if first one was done well enough, but second was not done well enough.', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '11': { '0': 1, '1': 1 } })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(0)
    })

    it('should open third exercise of first unit, if two exercise were finished yet', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '1': { '0': 10, '1': 10 } })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(2)
    })

    it('should open first exercise, if only second exercise was finished yet', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '1': { '1': 1 } })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(0)
    })

    it('should open third exercise of first unit, if three exercises were finished yet', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '1': { '0': 10, '1': 10, '2': 10 } })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(3)
    })

    it('should open first exercise of second unit, if first unit was finished yet', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '1': { '0': 10, '1': 10, '2': 10, '3': 10 } })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(2)
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first unit, if second unit was partly finished yet', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '2': { '1': 1, '2': 1 } })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first unit, if exercise progress is undefined', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', { '1': {} })
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first unit, if unit progress is undefined', async () => {
      mocked(getJob).mockReturnValueOnce(Promise.resolve(mockJobs()[0]))
      await storageCache.setItem('progress', {})
      const { unit, exerciseKey } = await getNextExerciseWithCheck()
      expect(unit.id.id).toBe(1)
      expect(exerciseKey).toBe(0)
    })
  })

  describe('getProgress', () => {
    beforeEach(() => {
      mocked(getUnitsOfJob).mockReturnValue(Promise.resolve([]))
    })

    it('should show zero if no progress yet', async () => {
      await storageCache.setItem('progress', {})
      const progress = await getProgress(storageCache.getItem('progress'), profession)
      expect(progress).toBe(0)
    })

    it('should round to zero if only one exercise was finished', async () => {
      await storageCache.setItem('progress', { '1': { '1': 1 } })
      const progress = await getProgress(storageCache.getItem('progress'), profession)
      expect(Math.round(progress)).toBe(0)
    })

    it('should show zero if only exercises of other units were finished', async () => {
      await storageCache.setItem('progress', { '3': { '1': 1 } })
      const progress = await getProgress(storageCache.getItem('progress'), profession)
      expect(progress).toBe(0)
    })

    it('should show 0.5 or lesser if one of two units are finished', async () => {
      await storageCache.setItem('progress', { '10': { '0': 1, '1': 1, '2': 1, '3': 1 } })
      const progress = await getProgress(storageCache.getItem('progress'), profession)
      expect(progress).toBeLessThanOrEqual(0.5)
    })
  })

  describe('willUnlockNextExercise', () => {
    it('should unlock if exercise is done good enough for the first time', () => {
      expect(willNextExerciseUnlock(undefined, SCORE_THRESHOLD_UNLOCK + 1)).toBeTruthy()
    })

    it('should unlock if exercise is done good enough for the second time', () => {
      expect(willNextExerciseUnlock(SCORE_THRESHOLD_UNLOCK, SCORE_THRESHOLD_UNLOCK + 1)).toBeTruthy()
    })

    it('should not unlock if exercise is already unlocked', () => {
      expect(willNextExerciseUnlock(SCORE_THRESHOLD_UNLOCK + 1, SCORE_THRESHOLD_UNLOCK + 3)).toBeFalsy()
    })

    it('should not unlock if exercise was done bad', () => {
      expect(willNextExerciseUnlock(undefined, SCORE_THRESHOLD_UNLOCK)).toBeFalsy()
    })
  })

  describe('calculateScore', () => {
    const getVocabularyItemWithResults = (
      numberOfTries: [number, number, number, number],
      results: [SimpleResult, SimpleResult, SimpleResult, SimpleResult],
    ): VocabularyItemResult[] => {
      const vocabularyItems = new VocabularyItemBuilder(4).build()
      return vocabularyItems.map((vocabularyItem, index) => ({
        vocabularyItem,
        result: results[index],
        numberOfTries: numberOfTries[index],
      }))
    }

    it('should calculate score correctly for different number of tries', () => {
      const score = calculateScore(
        getVocabularyItemWithResults([1, 2, 3, 3], ['correct', 'correct', 'correct', 'incorrect']),
      )
      expect(score).toBe(4)
    })

    it('should calculate score correctly for best result', () => {
      const score = calculateScore(
        getVocabularyItemWithResults([1, 1, 1, 1], ['correct', 'correct', 'correct', 'correct']),
      )
      expect(score).toBe(10)
    })

    it('should calculate score correctly for bad result with similar results', () => {
      const score = calculateScore(
        getVocabularyItemWithResults([3, 3, 3, 3], ['similar', 'incorrect', 'incorrect', 'incorrect']),
      )
      expect(score).toBe(0)
    })
  })

  describe('getSortedAndFilteredVocabularyItems', () => {
    const testData = new VocabularyItemBuilder(10).build()
    it('should check words with ö,ä,ü whether they are found correctly when searching for both ö,ü,a and o,u,a', () => {
      const resultForO = getSortedAndFilteredVocabularyItems(testData, 'ö')
      const resultForA = getSortedAndFilteredVocabularyItems(testData, 'ä')
      const resultForU = getSortedAndFilteredVocabularyItems(testData, 'ü')
      expect(resultForO).toHaveLength(5)
      expect(resultForA).toHaveLength(6)
      expect(resultForU).toHaveLength(4)
    })

    it('should check alternative words with ö,ä,ü whether they are found correctly when searching for both ö,ü,a and o,u,a', () => {
      const resultForOe = getSortedAndFilteredVocabularyItems(testData, 'ölkännchen')
      const resultForAe = getSortedAndFilteredVocabularyItems(testData, 'abhänger')
      const resultForUe = getSortedAndFilteredVocabularyItems(testData, 'holzdübel')
      const resultForO = getSortedAndFilteredVocabularyItems(testData, 'olkannchen')
      const resultForA = getSortedAndFilteredVocabularyItems(testData, 'abhanger')
      const resultForU = getSortedAndFilteredVocabularyItems(testData, 'holzdubel')
      expect(resultForOe).toEqual(resultForO)
      expect(resultForAe).toEqual(resultForA)
      expect(resultForUe).toEqual(resultForU)
    })

    it('should show correctly ordering of the words in the list, words starting with special chars should not be placed at the end', () => {
      const sortedData: VocabularyItem[] = [
        {
          id: 5,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Abhänger',
          article: ARTICLES[3],
          audio: '',
          images: ['image'],
          alternatives: [
            {
              word: 'Abhänger',
              article: ARTICLES[2],
            },
          ],
        },
        {
          id: 8,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Akkuschrauber',
          article: ARTICLES[1],
          audio: '',
          images: ['image'],
          alternatives: [],
        },
        {
          id: 2,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Auto',
          article: ARTICLES[3],
          images: ['image'],
          audio: '',
          alternatives: [],
        },
        {
          id: 4,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Helm',
          article: ARTICLES[1],
          audio: '',
          images: ['image'],
          alternatives: [],
        },
        {
          id: 3,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Hose',
          article: ARTICLES[2],
          audio: '',
          images: ['image'],
          alternatives: [],
        },
        {
          id: 9,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Oberarm',
          article: ARTICLES[1],
          audio: '',
          images: ['image'],
          alternatives: [],
        },
        {
          id: 6,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Ölkanne',
          article: ARTICLES[1],
          audio: '',
          images: ['image'],
          alternatives: [
            {
              word: 'Ölkännchen',
              article: ARTICLES[3],
            },
          ],
        },
        {
          id: 7,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Riffeldübel',
          article: ARTICLES[1],
          audio: '',
          images: ['image'],
          alternatives: [
            {
              word: 'Holzdübel',
              article: ARTICLES[1],
            },
          ],
        },

        {
          id: 1,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Spachtel',
          article: ARTICLES[1],
          images: ['image'],
          audio: 'https://example.com/my-audio',
          alternatives: [
            {
              word: 'Spachtel',
              article: ARTICLES[2],
            },
            {
              word: 'Alternative',
              article: ARTICLES[2],
            },
          ],
        },
        {
          id: 10,
          type: VOCABULARY_ITEM_TYPES.lunesStandard,
          word: 'Untergrund',
          article: ARTICLES[1],
          audio: '',
          images: ['image'],
          alternatives: [],
        },
      ]
      const sortedTestData = getSortedAndFilteredVocabularyItems(testData, '')
      expect(sortedData).toEqual(sortedTestData)
    })
  })

  describe('searchProfessions', () => {
    it('should find a profession', () => {
      const jobs = mockJobs()
      expect(searchJobs(jobs, 'jo')).toStrictEqual(jobs)
      expect(searchJobs(jobs, 'SECOND')).toStrictEqual([jobs[1]])
      expect(searchJobs(jobs, 'd job')).toStrictEqual([jobs[1], jobs[2]])
    })

    it('should not find a profession', () => {
      const jobs = mockJobs()
      expect(searchJobs(jobs, 'fourth unit')).toStrictEqual([])
      expect(searchJobs(jobs, 'Maler')).toStrictEqual([])
    })
  })
})
