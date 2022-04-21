import { ExerciseKeys } from '../../constants/data'
import { mockDisciplines } from '../../testing/mockDiscipline'
import AsyncStorage from '../AsyncStorage'

describe('AsyncStorage', () => {
  const customDisciplines = ['first', 'second', 'third']

  it('should delete customDisicpline from array if exists', async () => {
    await AsyncStorage.setCustomDisciplines(customDisciplines)
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
    await AsyncStorage.removeCustomDiscipline('first')
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
  })

  it('should not delete customDisicpline from array if not exists', async () => {
    await AsyncStorage.setCustomDisciplines(customDisciplines)
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
    await expect(AsyncStorage.removeCustomDiscipline('fourth')).rejects.toThrow('customDiscipline not available')
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
  })

  const selectedProfessions = mockDisciplines

  it('should delete selectedProfession from array if exists', async () => {
    await AsyncStorage.setSelectedProfessions(selectedProfessions)
    await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length)
    await AsyncStorage.removeSelectedProfession(mockDisciplines[0])
    await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length - 1)
  })

  it('should not delete selectedProfession from array if not exists', async () => {
    await AsyncStorage.setSelectedProfessions([mockDisciplines[1]])
    await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
    await AsyncStorage.removeSelectedProfession(mockDisciplines[0])
    await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
  })

  it('should push selectedProfession to array', async () => {
    await AsyncStorage.setSelectedProfessions([mockDisciplines[0]])
    await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
    await AsyncStorage.pushSelectedProfession(mockDisciplines[1])
    await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(2)
  })

  describe('ExerciseProgress', () => {
    const firstExercise = { disciplineId: 1, exerciseKey: ExerciseKeys.wordChoiceExercise, score: 0.5 }
    const secondExercise = { disciplineId: 1, exerciseKey: ExerciseKeys.writeExercise, score: 0.5 }
    const secondExerciseBetter = { disciplineId: 1, exerciseKey: ExerciseKeys.writeExercise, score: 0.75 }

    beforeEach(() => AsyncStorage.clearExerciseProgress())

    it('should save progress for not yet done discipline', async () => {
      await AsyncStorage.setExerciseProgress(firstExercise)
      await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual([firstExercise])
    })

    it('should save progress for done discipline but not yet done exercise', async () => {
      await AsyncStorage.setExerciseProgress(firstExercise)
      await AsyncStorage.setExerciseProgress(secondExercise)
      await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual([firstExercise, secondExercise])
    })

    it('should save progress for done exercise with improvement', async () => {
      await AsyncStorage.setExerciseProgress(secondExercise)
      await AsyncStorage.setExerciseProgress(secondExerciseBetter)
      await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual([secondExerciseBetter])
    })

    it('should not save progress for done exercise without improvement', async () => {
      await AsyncStorage.setExerciseProgress(secondExercise)
      await AsyncStorage.setExerciseProgress(secondExercise)
      await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual([secondExercise])
    })
  })
})
