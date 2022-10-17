import { ExerciseKeys, Progress, SIMPLE_RESULTS } from '../../constants/data'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import {
  getCustomDisciplines,
  deleteUserVocabularyItem,
  getFavorites,
  setFavorites,
  addUserVocabularyItem,
  pushSelectedProfession,
  removeCustomDiscipline,
  setExerciseProgress,
  saveExerciseProgress,
  addFavorite,
  removeFavorite,
  setCustomDisciplines,
  getUserVocabularyItems,
  getSelectedProfessions,
  getExerciseProgress,
  editUserVocabularyItem,
  removeSelectedProfession,
  setSelectedProfessions,
} from '../AsyncStorage'

describe('AsyncStorage', () => {
  describe('customDisciplines', () => {
    const customDisciplines = ['first', 'second', 'third']

    it('should delete customDisicpline from array if exists', async () => {
      await setCustomDisciplines(customDisciplines)
      await expect(getCustomDisciplines()).resolves.toHaveLength(3)
      await removeCustomDiscipline('first')
      await expect(getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
    })

    it('should not delete customDiscipline from array if not exists', async () => {
      await setCustomDisciplines(customDisciplines)
      await expect(getCustomDisciplines()).resolves.toHaveLength(3)
      await expect(removeCustomDiscipline('fourth')).rejects.toThrow('customDiscipline not available')
      await expect(getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
    })
  })

  describe('selectedProfessions', () => {
    const selectedProfessions = mockDisciplines()

    it('should delete selectedProfession from array if exists', async () => {
      await setSelectedProfessions(selectedProfessions.map(item => item.id))
      await expect(getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length)
      await removeSelectedProfession(mockDisciplines()[0].id)
      await expect(getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await setSelectedProfessions([mockDisciplines()[1].id])
      await expect(getSelectedProfessions()).resolves.toHaveLength(1)
      await removeSelectedProfession(mockDisciplines()[0].id)
      await expect(getSelectedProfessions()).resolves.toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await setSelectedProfessions([mockDisciplines()[0].id])
      await expect(getSelectedProfessions()).resolves.toHaveLength(1)
      await pushSelectedProfession(mockDisciplines()[1].id)
      await expect(getSelectedProfessions()).resolves.toHaveLength(2)
    })

    describe('ExerciseProgress', () => {
      it('should save progress for not yet done discipline', async () => {
        const progressOneExercise: Progress = {
          1: { [ExerciseKeys.wordChoiceExercise]: 0.5 },
        }
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await expect(getExerciseProgress()).resolves.toStrictEqual(progressOneExercise)
      })

      it('should save progress for done discipline but not yet done exercise', async () => {
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(1, ExerciseKeys.writeExercise, 0.6)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5, [ExerciseKeys.writeExercise]: 0.6 })
      })

      it('should save progress for done exercise with improvement', async () => {
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.8)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.8 })
      })

      it('should not save progress for done exercise without improvement', async () => {
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.4)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5 })
      })

      it('should calculate and save exercise progress correctly', async () => {
        const vocabularyItems = new VocabularyItemBuilder(2).build()
        const vocabularyItemResults: VocabularyItemResult[] = [
          {
            vocabularyItem: vocabularyItems[0],
            result: SIMPLE_RESULTS.correct,
            numberOfTries: 1,
          },
          {
            vocabularyItem: vocabularyItems[0],
            result: SIMPLE_RESULTS.incorrect,
            numberOfTries: 3,
          },
        ]
        await saveExerciseProgress(1, 1, vocabularyItemResults)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 5 })
      })
    })
  })

  describe('favorites', () => {
    const vocabularyItems = new VocabularyItemBuilder(4).build().map(it => it.id)

    it('should add favorites', async () => {
      await setFavorites(vocabularyItems.slice(0, 2))
      await expect(getFavorites()).resolves.toEqual(vocabularyItems.slice(0, 2))
      await addFavorite(vocabularyItems[2])
      await expect(getFavorites()).resolves.toEqual(vocabularyItems.slice(0, 3))
      await addFavorite(vocabularyItems[3])
      await expect(getFavorites()).resolves.toEqual(vocabularyItems)
    })

    it('should remove favorites', async () => {
      await setFavorites(vocabularyItems)
      await expect(getFavorites()).resolves.toEqual(vocabularyItems)
      await removeFavorite(vocabularyItems[2])
      await expect(getFavorites()).resolves.toEqual([vocabularyItems[0], vocabularyItems[1], vocabularyItems[3]])
      await removeFavorite(vocabularyItems[0])
      await expect(getFavorites()).resolves.toEqual([vocabularyItems[1], vocabularyItems[3]])
    })
  })

  describe('userVocabularyItems', () => {
    const userVocabularyItems = new VocabularyItemBuilder(2).build()

    it('should add userVocabularyItem', async () => {
      const userVocabulary = await getUserVocabularyItems()
      expect(userVocabulary).toHaveLength(0)
      await addUserVocabularyItem(userVocabularyItems[0])
      const updatedUserVocabulary = await getUserVocabularyItems()
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userVocabularyItem', async () => {
      await addUserVocabularyItem(userVocabularyItems[0])
      await editUserVocabularyItem(userVocabularyItems[0], userVocabularyItems[1])
      const updatedUserVocabulary = await getUserVocabularyItems()
      expect(updatedUserVocabulary).toHaveLength(1)
      expect(updatedUserVocabulary[0]).toEqual(userVocabularyItems[1])
    })

    it('should delete userVocabularyItem', async () => {
      await addUserVocabularyItem(userVocabularyItems[0])
      const userVocabulary = await getUserVocabularyItems()
      expect(userVocabulary).toHaveLength(1)
      await deleteUserVocabularyItem(userVocabularyItems[0])
      const updatedUserVocabulary = await getUserVocabularyItems()
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })
})
