import { NextExercise, SCORE_THRESHOLD_UNLOCK, SimpleResult } from '../../constants/data'
import { loadDiscipline } from '../../hooks/useLoadDiscipline'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import { getExerciseProgress } from '../AsyncStorage'
import { calculateScore, getNextExercise, getProgress, willNextExerciseUnlock } from '../helpers'

import mocked = jest.mocked

jest.mock('../../hooks/useLoadDiscipline')
jest.mock('../AsyncStorage')

describe('helpers', () => {
  const profession = mockDisciplines()[0]
  describe('getNextExercise', () => {
    const getNextExerciseWithCheck = async (): Promise<NextExercise> => getNextExercise(profession)

    it('should open first exercise, if no exercise was finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({}))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open third exercise of first discipline, if two exercise were finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '0': 1, '1': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(2)
    })

    it('should open first exercise, if only second exercise was finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '1': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open third exercise of first discipline, if three exercises were finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '0': 1, '1': 1, '2': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(3)
    })

    it('should open first exercise of second discipline, if first discipline was finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '0': 1, '1': 1, '2': 1, '3': 1 } }))

      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![1])
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first discipline, if second discipline was partly finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '11': { '1': 1, '2': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first discipline, if exercise progress is undefined', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '1': undefined } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first discipline, if discipline progress is undefined', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': undefined }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })
  })

  describe('getProgress', () => {
    it('should show zero if no progress yet', async () => {
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({}))
      const progress = await getProgress(profession)
      expect(progress).toBe(0)
    })

    it('should round to zero if only one exercise was finished', async () => {
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': 1 } }))
      const progress = await getProgress(profession)
      expect(Math.round(progress)).toBe(0)
    })

    it('should show zero if only exercises of other disciplines where finished', async () => {
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '3': { '1': 1 } }))
      const progress = await getProgress(profession)
      expect(progress).toBe(0)
    })

    it('should show 0.5 if one of two disciplines are finished', async () => {
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '0': 1, '1': 1, '2': 1, '3': 1 } }))
      const progress = await getProgress(profession)
      expect(progress).toBe(0.5)
    })
  })

  describe('willUnlockNextExercise', () => {
    it('should unlock if exercise is done good enough for the first time', () => {
      expect(willNextExerciseUnlock(undefined, SCORE_THRESHOLD_UNLOCK + 1)).toBeTruthy()
    })

    it('should unlock if exercise is done good enough for the scond time', () => {
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
      results: [SimpleResult, SimpleResult, SimpleResult, SimpleResult]
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
        getVocabularyItemWithResults([1, 2, 3, 3], ['correct', 'correct', 'correct', 'incorrect'])
      )
      expect(score).toBe(4)
    })

    it('should calculate score correctly for best result', () => {
      const score = calculateScore(
        getVocabularyItemWithResults([1, 1, 1, 1], ['correct', 'correct', 'correct', 'correct'])
      )
      expect(score).toBe(10)
    })

    it('should calculate score correctly for bad result with similar results', () => {
      const score = calculateScore(
        getVocabularyItemWithResults([3, 3, 3, 3], ['similar', 'incorrect', 'incorrect', 'incorrect'])
      )
      expect(score).toBe(0)
    })
  })
})
