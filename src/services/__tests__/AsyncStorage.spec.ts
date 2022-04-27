import RNAsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKeys, Progress } from '../../constants/data'
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
    beforeEach(() => {
      jest.clearAllMocks()
      RNAsyncStorage.clear()
    })

    it('should save progress for not yet done discipline', async () => {
      const progressOneExercise: Progress = {
        1: { [ExerciseKeys.wordChoiceExercise]: 0.5 }
      }
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
      await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual(progressOneExercise)
    })

    it('should save progress for done discipline but not yet done exercise', async () => {
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.writeExercise, 0.6)
      const progress = await AsyncStorage.getExerciseProgress()
      expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5, [ExerciseKeys.writeExercise]: 0.6 })
    })

    it('should save progress for done exercise with improvement', async () => {
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.8)
      const progress = await AsyncStorage.getExerciseProgress()
      expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.8 })
    })

    it('should not save progress for done exercise without improvement', async () => {
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
      await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.4)
      const progress = await AsyncStorage.getExerciseProgress()
      expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5 })
    })
  })
})
