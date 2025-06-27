import { ExerciseKeys, Favorite, Progress, SIMPLE_RESULTS, VOCABULARY_ITEM_TYPES } from '../../constants/data'
import { VocabularyItem } from '../../constants/endpoints'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import { RepetitionService } from '../RepetitionService'
import { StorageCache } from '../Storage'
import {
  addFavorite,
  addUserVocabularyItem,
  deleteUserVocabularyItem,
  editUserVocabularyItem,
  getUserVocabularyItems,
  pushSelectedProfession,
  removeCustomDiscipline,
  removeFavorite,
  removeSelectedProfession,
  saveExerciseProgress,
  setExerciseProgress,
} from '../storageUtils'

jest.mock('react-native-fs', () => ({
  unlink: jest.fn(),
}))

describe('storageUtils', () => {
  let storageCache: StorageCache
  let repetitionService: RepetitionService

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    repetitionService = RepetitionService.fromStorageCache(storageCache)
  })

  describe('customDisciplines', () => {
    const makeCustomDisciplines = () => ['first', 'second', 'third']

    it('should delete customDiscipline from array if exists', async () => {
      await storageCache.setItem('customDisciplines', makeCustomDisciplines())
      expect(storageCache.getItem('customDisciplines')).toHaveLength(3)
      await removeCustomDiscipline(storageCache, 'first')
      expect(storageCache.getItem('customDisciplines')).toStrictEqual(['second', 'third'])
    })

    it('should not delete customDiscipline from array if not exists', async () => {
      await storageCache.setItem('customDisciplines', makeCustomDisciplines())
      expect(storageCache.getItem('customDisciplines')).toHaveLength(3)
      await expect(removeCustomDiscipline(storageCache, 'fourth')).rejects.toThrow('customDiscipline not available')
      expect(storageCache.getItem('customDisciplines')).toStrictEqual(['first', 'second', 'third'])
    })
  })

  describe('selectedProfessions', () => {
    const selectedProfessions = mockDisciplines()

    it('should delete selectedProfession from array if exists', async () => {
      await storageCache.setItem(
        'selectedProfessions',
        selectedProfessions.map(item => item.id),
      )
      expect(storageCache.getItem('selectedProfessions')).toHaveLength(selectedProfessions.length)
      await removeSelectedProfession(storageCache, mockDisciplines()[0].id)
      expect(storageCache.getItem('selectedProfessions')).toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await storageCache.setItem('selectedProfessions', [mockDisciplines()[1].id])
      expect(storageCache.getItem('selectedProfessions')).toHaveLength(1)
      await removeSelectedProfession(storageCache, mockDisciplines()[0].id)
      expect(storageCache.getItem('selectedProfessions')).toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await storageCache.setItem('selectedProfessions', [mockDisciplines()[0].id])
      expect(storageCache.getItem('selectedProfessions')).toHaveLength(1)
      await pushSelectedProfession(storageCache, mockDisciplines()[1].id)
      expect(storageCache.getItem('selectedProfessions')).toHaveLength(2)
    })

    describe('ExerciseProgress', () => {
      it('should save progress for not yet done discipline', async () => {
        const progressOneExercise: Progress = {
          1: { [ExerciseKeys.wordChoiceExercise]: 0.5 },
        }
        await setExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, 0.5)
        expect(storageCache.getItem('progress')).toStrictEqual(progressOneExercise)
      })

      it('should save progress for done discipline but not yet done exercise', async () => {
        await setExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(storageCache, 1, ExerciseKeys.writeExercise, 0.6)
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5, [ExerciseKeys.writeExercise]: 0.6 })
      })

      it('should save progress for done exercise with improvement', async () => {
        await setExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, 0.8)
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.8 })
      })

      it('should not save progress for done exercise without improvement', async () => {
        await setExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, 0.4)
        const progress = storageCache.getItem('progress')
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
        await saveExerciseProgress(storageCache, 1, ExerciseKeys.wordChoiceExercise, vocabularyItemResults)
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 5 })

        const words = repetitionService.getWordNodeCards()
        expect(words).toHaveLength(2)
      })

      it('should not update the repetition words for the first level', async () => {
        const vocabularyItems = new VocabularyItemBuilder(2).build()
        const vocabularyItemResults: VocabularyItemResult[] = [
          {
            vocabularyItem: vocabularyItems[0],
            result: SIMPLE_RESULTS.correct,
            numberOfTries: 1,
          },
        ]
        await saveExerciseProgress(storageCache, 1, ExerciseKeys.vocabularyList, vocabularyItemResults)
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.vocabularyList]: 10 })

        const words = repetitionService.getWordNodeCards()
        expect(words).toHaveLength(0)
      })
    })
  })

  describe('favorites', () => {
    const vocabularyItems: VocabularyItem[] = new VocabularyItemBuilder(4).build()
    const favoriteItems: Favorite[] = vocabularyItems.map(it => ({
      id: it.id,
      vocabularyItemType: VOCABULARY_ITEM_TYPES.lunesStandard,
    }))

    it('should add favorites', async () => {
      await storageCache.setItem('favorites', favoriteItems.slice(0, 2))
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems.slice(0, 2))
      expect(repetitionService.getWordNodeCards()).toHaveLength(0)
      await addFavorite(storageCache, repetitionService, vocabularyItems[2])
      expect(repetitionService.getWordNodeCards().map(wordNodeCard => wordNodeCard.word.id)).toStrictEqual([
        vocabularyItems[2].id,
      ])
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems.slice(0, 3))
      await addFavorite(storageCache, repetitionService, vocabularyItems[3])
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems)
      expect(repetitionService.getWordNodeCards().map(wordNodeCard => wordNodeCard.word.id)).toStrictEqual([
        vocabularyItems[2].id,
        vocabularyItems[3].id,
      ])
    })

    it('should remove favorites', async () => {
      await storageCache.setItem('favorites', favoriteItems)
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems)
      await removeFavorite(storageCache, favoriteItems[2])
      expect(storageCache.getItem('favorites')).toEqual([favoriteItems[0], favoriteItems[1], favoriteItems[3]])
      await removeFavorite(storageCache, favoriteItems[0])
      expect(storageCache.getItem('favorites')).toEqual([favoriteItems[1], favoriteItems[3]])
    })
  })

  describe('userVocabulary', () => {
    const userVocabularyItems = new VocabularyItemBuilder(3)
      .build()
      .map(item => ({ ...item, type: VOCABULARY_ITEM_TYPES.userCreated }))

    it('should add userVocabularyItem', async () => {
      const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
      expect(userVocabulary).toHaveLength(0)
      await addUserVocabularyItem(storageCache, userVocabularyItems[0])
      const updatedUserVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userVocabularyItem', async () => {
      await addUserVocabularyItem(storageCache, userVocabularyItems[1])
      await editUserVocabularyItem(storageCache, userVocabularyItems[1], {
        ...userVocabularyItems[2],
        id: userVocabularyItems[1].id,
      })
      const updatedUserVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
      expect(updatedUserVocabulary).toHaveLength(1)
      expect({ ...userVocabularyItems[2], id: userVocabularyItems[1].id }).toEqual(updatedUserVocabulary[0])
    })

    it('should delete userVocabularyItem', async () => {
      await addUserVocabularyItem(storageCache, userVocabularyItems[0])
      const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
      expect(userVocabulary).toHaveLength(1)
      await deleteUserVocabularyItem(storageCache, userVocabularyItems[0])
      const updatedUserVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })
})
