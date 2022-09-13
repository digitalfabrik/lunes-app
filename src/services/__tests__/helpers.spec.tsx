import { NextExercise, SimpleResult } from '../../constants/data'
import { loadDiscipline } from '../../hooks/useLoadDiscipline'
import { DocumentResult } from '../../navigation/NavigationTypes'
import DocumentBuilder from '../../testing/DocumentBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import AsyncStorage from '../AsyncStorage'
import { calculateScore, getNextExercise, getProgress } from '../helpers'

import mocked = jest.mocked

jest.mock('../../hooks/useLoadDiscipline')
jest.mock('../AsyncStorage')

describe('helpers', () => {
  const profession = mockDisciplines()[0]
  describe('getNextExercise', () => {
    const getNextExerciseWithCheck = async (): Promise<NextExercise> => getNextExercise(profession)

    it('should open first exercise, if no exercise was finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({}))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open third exercise of first discipline, if two exercise were finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '0': 1, '1': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(2)
    })

    it('should open first exercise, if only second exercise was finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '1': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open third exercise of first discipline, if three exercises were finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(
        Promise.resolve({ '10': { '0': 1, '1': 1, '2': 1 } })
      )
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(3)
    })

    it('should open first exercise of second discipline, if first discipline was finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(
        Promise.resolve({ '10': { '0': 1, '1': 1, '2': 1, '3': 1 } })
      )

      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![1])
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first discipline, if second discipline was partly finished yet', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '11': { '1': 1, '2': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first discipline, if exercise progress is undefined', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': { '1': undefined } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })

    it('should open first exercise of first discipline, if discipline progress is undefined', async () => {
      mocked(loadDiscipline).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)[0]))
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '10': undefined }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].leafDisciplines![0])
      expect(exerciseKey).toBe(0)
    })
  })

  describe('getProgress', () => {
    it('should show zero if no progress yet', async () => {
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({}))
      const progress = await getProgress(profession)
      expect(progress).toBe(0)
    })

    it('should round to zero if only one exercise was finished', async () => {
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': 1 } }))
      const progress = await getProgress(profession)
      expect(Math.round(progress)).toBe(0)
    })

    it('should show zero if only exercises of other disciplines where finished', async () => {
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '3': { '1': 1 } }))
      const progress = await getProgress(profession)
      expect(progress).toBe(0)
    })

    it('should show 0.5 if one of two disciplines are finished', async () => {
      mocked(AsyncStorage.getExerciseProgress).mockReturnValueOnce(
        Promise.resolve({ '10': { '0': 1, '1': 1, '2': 1, '3': 1 } })
      )
      const progress = await getProgress(profession)
      expect(progress).toBe(0.5)
    })
  })

  describe('calculateScore', () => {
    const getDocumentsWithResults = (
      numberOfTries: [number, number, number, number],
      results: [SimpleResult, SimpleResult, SimpleResult, SimpleResult]
    ): DocumentResult[] => {
      const documents = new DocumentBuilder(4).build()
      return documents.map((document, index) => ({
        document,
        result: results[index],
        numberOfTries: numberOfTries[index],
      }))
    }

    it('should calculate score correctly for different number of tries', () => {
      const score = calculateScore(
        getDocumentsWithResults([1, 2, 3, 3], ['correct', 'correct', 'correct', 'incorrect'])
      )
      expect(score).toBe(4)
    })

    it('should calculate score correctly for best result', () => {
      const score = calculateScore(getDocumentsWithResults([1, 1, 1, 1], ['correct', 'correct', 'correct', 'correct']))
      expect(score).toBe(10)
    })

    it('should calculate score correctly for bad result with similar results', () => {
      const score = calculateScore(
        getDocumentsWithResults([3, 3, 3, 3], ['similar', 'incorrect', 'incorrect', 'incorrect'])
      )
      expect(score).toBe(0)
    })
  })
})
