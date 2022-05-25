import { NextExercise } from '../../constants/data'
import { loadDisciplines } from '../../hooks/useLoadDisciplines'
import { mockDisciplines } from '../../testing/mockDiscipline'
import { getExerciseProgress } from '../AsyncStorage'
import { getNextExercise, getProgress } from '../helpers'

import mocked = jest.mocked

jest.mock('../../hooks/useLoadDisciplines')
jest.mock('../AsyncStorage')

describe('helpers', () => {
  const profession = {
    id: 10,
    title: 'Parent Discipline',
    description: 'Description of Parent',
    icon: 'none',
    numberOfChildren: 2,
    isLeaf: false,
    parentTitle: null,
    needsTrainingSetEndpoint: false,
    leafDisciplines: [1, 2]
  }

  describe('getNextExercise', () => {
    const getNextExerciseWithCheck = async (): Promise<NextExercise> => {
      const e = await getNextExercise(profession)
      if (!e) {
        throw Error('NextExerciseData is undefined')
      }
      return e
    }

    it('should open first exercise, if no exercise was finished yet', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({}))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(1)
    })

    it('should open second exercise of first discipline, if first exercise was finished yet', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(2)
    })

    it('should open first exercise, if only second exercise was finished yet', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '2': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(1)
    })

    it('should open third exercise of first discipline, if two exercises were finished yet', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': 1, '2': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(3)
    })

    it('should open first exercise of second discipline, if first discipline was finished yet', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': 1, '2': 1, '3': 1 } }))

      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[1].id)
      expect(exerciseKey).toBe(1)
    })

    it('should open first exercise of first discipline, if second discipline was partly finished yet', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '2': { '1': 1, '2': 1 } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(1)
    })

    it('should open first exercise of first discipline, if exercise progress is undefined', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': undefined } }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(1)
    })

    it('should open first exercise of first discipline, if discipline progress is undefined', async () => {
      mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': undefined }))
      const { disciplineId, exerciseKey } = await getNextExerciseWithCheck()
      expect(disciplineId).toBe(mockDisciplines()[0].id)
      expect(exerciseKey).toBe(1)
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
      mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve({ '1': { '1': 1, '2': 1, '3': 1 } }))
      const progress = await getProgress(profession)
      expect(progress).toBe(0.5)
    })
  })
})
