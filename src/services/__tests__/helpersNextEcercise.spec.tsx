import { loadDisciplines } from '../../hooks/useLoadDisciplines'
import { mockDisciplines } from '../../testing/mockDiscipline'
import { getExerciseProgress } from '../AsyncStorage'
import { getNextExercise } from '../helpers'

import mocked = jest.mocked

jest.mock('../../hooks/useLoadDisciplines')
jest.mock('../AsyncStorage')

describe('Calculation of next exercise', () => {
  const profession = {
    id: 10,
    title: 'Parent Discipline',
    description: 'Description of Parent',
    icon: 'none',
    numberOfChildren: 2,
    isLeaf: false,
    parentTitle: null,
    needsTrainingSetEndpoint: false
  }

  it('should open first exercise, if no exercise was finished yet', async () => {
    mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
    mocked(getExerciseProgress).mockReturnValueOnce(Promise.resolve([]))
    const [disciplineId, exerciseId] = await getNextExercise(profession)
    expect(disciplineId).toBe(mockDisciplines()[0].id)
    expect(exerciseId).toBe(1)
  })

  it('should open second exercise of first discipline, if first exercise was finished yet', async () => {
    mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
    mocked(getExerciseProgress).mockReturnValueOnce(
      Promise.resolve([{ disciplineId: 1, exerciseProgress: [{ exerciseKey: 1, score: 1 }] }])
    )
    const [disciplineId, exerciseId] = await getNextExercise(profession)
    expect(disciplineId).toBe(mockDisciplines()[0].id)
    expect(exerciseId).toBe(2)
  })

  it('should open first exercise, if only second exercise was finished yet', async () => {
    mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
    mocked(getExerciseProgress).mockReturnValueOnce(
      Promise.resolve([{ disciplineId: 1, exerciseProgress: [{ exerciseKey: 2, score: 1 }] }])
    )
    const [disciplineId, exerciseId] = await getNextExercise(profession)
    expect(disciplineId).toBe(mockDisciplines()[0].id)
    expect(exerciseId).toBe(1)
  })

  it('should open third exercise of first discipline, if two exercises were finished yet', async () => {
    mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
    mocked(getExerciseProgress).mockReturnValueOnce(
      Promise.resolve([
        {
          disciplineId: 1,
          exerciseProgress: [
            { exerciseKey: 1, score: 1 },
            { exerciseKey: 2, score: 1 }
          ]
        }
      ])
    )
    const [disciplineId, exerciseId] = await getNextExercise(profession)
    expect(disciplineId).toBe(mockDisciplines()[0].id)
    expect(exerciseId).toBe(3)
  })

  it('should open first exercise of second discipline, if first discipline was finished yet', async () => {
    mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
    mocked(getExerciseProgress).mockReturnValueOnce(
      Promise.resolve([
        {
          disciplineId: 1,
          exerciseProgress: [
            { exerciseKey: 1, score: 1 },
            { exerciseKey: 2, score: 1 },
            { exerciseKey: 3, score: 1 }
          ]
        }
      ])
    )
    const [disciplineId, exerciseId] = await getNextExercise(profession)
    expect(disciplineId).toBe(mockDisciplines()[1].id)
    expect(exerciseId).toBe(1)
  })

  it('should open first exercise of first discipline, if second discipline was partly finished yet', async () => {
    mocked(loadDisciplines).mockReturnValueOnce(Promise.resolve(mockDisciplines(true)))
    mocked(getExerciseProgress).mockReturnValueOnce(
      Promise.resolve([
        {
          disciplineId: 2,
          exerciseProgress: [
            { exerciseKey: 1, score: 1 },
            { exerciseKey: 2, score: 1 }
          ]
        }
      ])
    )
    const [disciplineId, exerciseId] = await getNextExercise(profession)
    expect(disciplineId).toBe(mockDisciplines()[0].id)
    expect(exerciseId).toBe(1)
  })
})
