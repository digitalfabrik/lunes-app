import { ExerciseKeys, Progress, SIMPLE_RESULTS } from '../../constants/data'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import AsyncStorage from '../AsyncStorage'

describe('AsyncStorage', () => {
  describe('customDisciplines', () => {
    const customDisciplines = ['first', 'second', 'third']

    it('should delete customDisicpline from array if exists', async () => {
      await AsyncStorage.setCustomDisciplines(customDisciplines)
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
      await AsyncStorage.removeCustomDiscipline('first')
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
    })

    it('should not delete customDiscipline from array if not exists', async () => {
      await AsyncStorage.setCustomDisciplines(customDisciplines)
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
      await expect(AsyncStorage.removeCustomDiscipline('fourth')).rejects.toThrow('customDiscipline not available')
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
    })
  })

  describe('selectedProfessions', () => {
    const selectedProfessions = mockDisciplines()

    it('should delete selectedProfession from array if exists', async () => {
      await AsyncStorage.setSelectedProfessions(selectedProfessions.map(item => item.id))
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length)
      await AsyncStorage.removeSelectedProfession(mockDisciplines()[0].id)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await AsyncStorage.setSelectedProfessions([mockDisciplines()[1].id])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
      await AsyncStorage.removeSelectedProfession(mockDisciplines()[0].id)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await AsyncStorage.setSelectedProfessions([mockDisciplines()[0].id])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
      await AsyncStorage.pushSelectedProfession(mockDisciplines()[1].id)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(2)
    })

    describe('ExerciseProgress', () => {
      it('should save progress for not yet done discipline', async () => {
        const progressOneExercise: Progress = {
          1: { [ExerciseKeys.wordChoiceExercise]: 0.5 },
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

      it('should calculate and save exercise progress correctly', async () => {
        const documents = new VocabularyItemBuilder(2).build()
        const documentsWithResults: VocabularyItemResult[] = [
          {
            vocabularyItem: documents[0],
            result: SIMPLE_RESULTS.correct,
            numberOfTries: 1,
          },
          {
            vocabularyItem: documents[0],
            result: SIMPLE_RESULTS.incorrect,
            numberOfTries: 3,
          },
        ]
        await AsyncStorage.saveExerciseProgress(1, 1, documentsWithResults)
        const progress = await AsyncStorage.getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 5 })
      })
    })
  })

  describe('favorites', () => {
    const documents = new VocabularyItemBuilder(4).build().map(it => it.id)

    it('should add favorites', async () => {
      await AsyncStorage.setFavorites(documents.slice(0, 2))
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents.slice(0, 2))
      await AsyncStorage.addFavorite(documents[2])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents.slice(0, 3))
      await AsyncStorage.addFavorite(documents[3])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents)
    })

    it('should remove favorites', async () => {
      await AsyncStorage.setFavorites(documents)
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents)
      await AsyncStorage.removeFavorite(documents[2])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual([documents[0], documents[1], documents[3]])
      await AsyncStorage.removeFavorite(documents[0])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual([documents[1], documents[3]])
    })
  })

  describe('userVocabulary', () => {
    const userDocuments = new VocabularyItemBuilder(2).build()

    it('should add userDocument', async () => {
      const userVocabulary = await AsyncStorage.getUserVocabulary()
      expect(userVocabulary).toHaveLength(0)
      await AsyncStorage.addUserDocument(userDocuments[0])
      const updatedUserVocabulary = await AsyncStorage.getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userDocument', async () => {
      await AsyncStorage.addUserDocument(userDocuments[0])
      await AsyncStorage.editUserDocument(userDocuments[0], userDocuments[1])
      const updatedUserVocabulary = await AsyncStorage.getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(1)
      expect(updatedUserVocabulary[0]).toEqual(userDocuments[1])
    })

    it('should delete userDocument', async () => {
      await AsyncStorage.addUserDocument(userDocuments[0])
      const userVocabulary = await AsyncStorage.getUserVocabulary()
      expect(userVocabulary).toHaveLength(1)
      await AsyncStorage.deleteUserDocument(userDocuments[0])
      const updatedUserVocabulary = await AsyncStorage.getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })
})
