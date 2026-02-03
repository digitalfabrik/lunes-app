import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKeys, Favorite, Progress, SIMPLE_RESULTS } from '../../constants/data'
import VocabularyItem, { UserVocabularyItem, VocabularyItemTypes } from '../../models/VocabularyItem'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockJobs } from '../../testing/mockJob'
import { RepetitionService, WordNodeCard } from '../RepetitionService'
import { loadStorageCache, STORAGE_VERSION, StorageCache, storageKeys } from '../Storage'
import {
  addFavorite,
  addJobWithPossiblyLostProgress,
  addUserVocabularyItem,
  deleteUserVocabularyItem,
  editUserVocabularyItem,
  FAVORITES_KEY_VERSION_0,
  pushSelectedJob,
  removeCustomDiscipline,
  removeFavorite,
  removeJobWithPossiblyLostProgress,
  removeSelectedJob,
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
    const selectedProfessions = mockJobs()

    it('should delete selectedProfession from array if exists', async () => {
      await storageCache.setItem(
        'selectedJobs',
        selectedProfessions.map(item => item.id.id),
      )
      expect(storageCache.getItem('selectedJobs')).toHaveLength(selectedProfessions.length)
      await removeSelectedJob(storageCache, mockJobs()[0].id)
      expect(storageCache.getItem('selectedJobs')).toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await storageCache.setItem('selectedJobs', [mockJobs()[1].id.id])
      expect(storageCache.getItem('selectedJobs')).toHaveLength(1)
      await removeSelectedJob(storageCache, mockJobs()[0].id)
      expect(storageCache.getItem('selectedJobs')).toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await storageCache.setItem('selectedJobs', [mockJobs()[0].id.id])
      expect(storageCache.getItem('selectedJobs')).toHaveLength(1)
      await pushSelectedJob(storageCache, mockJobs()[1].id)
      expect(storageCache.getItem('selectedJobs')).toHaveLength(2)
    })

    describe('ExerciseProgress', () => {
      it('should save progress for not yet done unit', async () => {
        const progressOneExercise: Progress = {
          1: { [ExerciseKeys.wordChoiceExercise]: 0.5 },
        }
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.wordChoiceExercise, 0.5)
        expect(storageCache.getItem('progress')).toStrictEqual(progressOneExercise)
      })

      it('should save progress for done unit but not yet done exercise', async () => {
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.writeExercise, 0.6)
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5, [ExerciseKeys.writeExercise]: 0.6 })
      })

      it('should save progress for done exercise with improvement', async () => {
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.wordChoiceExercise, 0.8)
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.8 })
      })

      it('should not save progress for done exercise without improvement', async () => {
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(storageCache, { id: 1, type: 'standard' }, ExerciseKeys.wordChoiceExercise, 0.4)
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
        await saveExerciseProgress(
          storageCache,
          { id: 1, type: 'standard' },
          ExerciseKeys.wordChoiceExercise,
          vocabularyItemResults,
        )
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
        await saveExerciseProgress(
          storageCache,
          { id: 1, type: 'standard' },
          ExerciseKeys.vocabularyList,
          vocabularyItemResults,
        )
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.vocabularyList]: 10 })

        const words = repetitionService.getWordNodeCards()
        expect(words).toHaveLength(0)
      })
    })
  })

  describe('favorites', () => {
    const vocabularyItems: VocabularyItem[] = new VocabularyItemBuilder(4).build()
    const favoriteItems: Favorite[] = vocabularyItems.map(it => it.id)

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

  describe('migrations', () => {
    it('should migrate from old version', async () => {
      await AsyncStorage.setItem(storageKeys.version, '0')
      const storageCache = await loadStorageCache()
      expect(storageCache.getItem('version')).toBe(STORAGE_VERSION)
    })

    it('should migrate to new favorite storage', async () => {
      await AsyncStorage.setItem(FAVORITES_KEY_VERSION_0, JSON.stringify([42, 84]))
      await expect(AsyncStorage.getItem(FAVORITES_KEY_VERSION_0)).resolves.not.toBeNull()
      await AsyncStorage.setItem(storageKeys.selectedJobs, '[]')
      const storageCache = await loadStorageCache()
      await expect(AsyncStorage.getItem(FAVORITES_KEY_VERSION_0)).resolves.toBeNull()
      const expectedFavorites: Favorite[] = [
        { id: 42, type: VocabularyItemTypes.Standard },
        {
          id: 84,
          type: VocabularyItemTypes.Standard,
        },
      ]
      expect(storageCache.getItem('favorites')).toEqual(expectedFavorites)
    })

    describe('should migrate from v1', () => {
      it('should migrate userVocabulary', async () => {
        await AsyncStorage.setItem('version', '1')
        await AsyncStorage.setItem(
          'userVocabulary',
          JSON.stringify([
            {
              id: 1,
              word: 'Testwort',
              article: { id: 3, value: 'das' },
              images: [{ id: 0, image: 'image-1' }],
              audio: null,
              alternatives: [],
            },
            {
              id: 2,
              word: 'Hund',
              article: { id: 1, value: 'der' },
              images: [{ id: 0, image: 'image-2' }],
              audio: null,
              alternatives: [],
            },
          ]),
        )

        const storageCache = await loadStorageCache()
        const expectedUserVocabulary: UserVocabularyItem[] = [
          {
            id: { index: 1, type: VocabularyItemTypes.UserCreated },
            word: 'Testwort',
            article: { id: 3, value: 'das' },
            images: ['image-1'],
            audio: null,
            alternatives: [],
          },
          {
            id: { index: 2, type: VocabularyItemTypes.UserCreated },
            word: 'Hund',
            article: { id: 1, value: 'der' },
            images: ['image-2'],
            audio: null,
            alternatives: [],
          },
        ]
        expect(storageCache.getItem('userVocabulary')).toEqual(expectedUserVocabulary)
      })

      it('should migrate wordNodeCards', async () => {
        await AsyncStorage.setItem('version', '1')
        await AsyncStorage.setItem(
          'wordNodeCards',
          JSON.stringify([
            {
              word: {
                id: 2,
                word: 'Hund',
                article: { id: 1, value: 'der' },
                images: [{ id: 0, image: 'image-1' }],
                audio: null,
                alternatives: [],
                type: VocabularyItemTypes.UserCreated,
              },
              section: 0,
              inThisSectionSince: new Date('2025-10-13'),
            },
            {
              word: {
                id: 3,
                word: 'lunes standard',
                article: { id: 1, value: 'der' },
                images: [{ id: 1, image: 'image-2' }],
                audio: null,
                alternatives: [],
                type: VocabularyItemTypes.Standard,
              },
              section: 0,
              inThisSectionSince: new Date('2025-10-13'),
            },
            {
              word: {
                id: 4,
                word: 'lunes protected',
                article: { id: 1, value: 'der' },
                images: [{ id: 2, image: 'image-3' }],
                audio: null,
                alternatives: [],
                type: VocabularyItemTypes.Protected,
                apiKey: 'abc123',
              },
              section: 0,
              inThisSectionSince: new Date('2025-10-13'),
            },
            {
              word: {
                id: 4,
                word: 'Invalid protected word',
                article: { id: 1, value: 'der' },
                images: [{ id: 2, image: 'image-3' }],
                audio: null,
                alternatives: [],
                type: VocabularyItemTypes.Protected,
              },
              section: 0,
              inThisSectionSince: new Date('2025-10-13'),
            },
          ]),
        )

        const storageCache = await loadStorageCache()
        const expectedWordNodeCards: WordNodeCard[] = [
          {
            word: {
              id: { type: VocabularyItemTypes.UserCreated, index: 2 },
              word: 'Hund',
              article: { id: 1, value: 'der' },
              images: ['image-1'],
              audio: null,
              alternatives: [],
            },
            section: 0,
            inThisSectionSince: new Date('2025-10-13'),
          },
          {
            word: {
              id: { type: VocabularyItemTypes.Standard, id: 3 },
              word: 'lunes standard',
              article: { id: 1, value: 'der' },
              images: ['image-2'],
              audio: null,
              alternatives: [],
            },
            section: 0,
            inThisSectionSince: new Date('2025-10-13'),
          },
          {
            word: {
              id: { type: VocabularyItemTypes.Protected, protectedId: 4, apiKey: 'abc123' },
              word: 'lunes protected',
              article: { id: 1, value: 'der' },
              images: ['image-3'],
              audio: null,
              alternatives: [],
            },
            section: 0,
            inThisSectionSince: new Date('2025-10-13'),
          },
        ]
        expect(JSON.stringify(storageCache.getItem('wordNodeCards'))).toStrictEqual(
          JSON.stringify(expectedWordNodeCards),
        )
      })
    })

    describe('should migrate from v2', () => {
      it('should migrate favorites', async () => {
        await AsyncStorage.setItem('version', '2')
        await AsyncStorage.setItem(
          'favorites-2',
          JSON.stringify([
            { id: 1, vocabularyItemType: VocabularyItemTypes.Standard },
            { id: 2, vocabularyItemType: VocabularyItemTypes.UserCreated },
            { id: 3, vocabularyItemType: VocabularyItemTypes.Protected, apiKey: 'abc123' },
            { id: 4, vocabularyItemType: VocabularyItemTypes.Protected },
          ]),
        )

        const storageCache = await loadStorageCache()
        const expectedFavorites: Favorite[] = [
          { id: 1, type: VocabularyItemTypes.Standard },
          { index: 2, type: VocabularyItemTypes.UserCreated },
          { protectedId: 3, apiKey: 'abc123', type: VocabularyItemTypes.Protected },
        ]
        expect(storageCache.getItem('favorites')).toEqual(expectedFavorites)
      })
    })

    describe('should migrate from v3', () => {
      it('should migrate jobsWithPossiblyLostProgress', async () => {
        const selectedJobs = [1, 2, 3]
        await AsyncStorage.setItem('version', '3')
        await AsyncStorage.setItem('selectedJobs', JSON.stringify(selectedJobs))

        const storageCache = await loadStorageCache()
        expect(storageCache.getItem('jobsWithPossiblyLostProgress')).toEqual(selectedJobs)
      })
    })
  })

  describe('userVocabulary', () => {
    const userVocabularyItems = new VocabularyItemBuilder(3).buildUserVocabulary()

    it('should add userVocabularyItem', async () => {
      const userVocabulary = storageCache.getItem('userVocabulary')
      expect(userVocabulary).toHaveLength(0)
      await addUserVocabularyItem(storageCache, userVocabularyItems[0])
      const updatedUserVocabulary = storageCache.getItem('userVocabulary')
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userVocabularyItem', async () => {
      await addUserVocabularyItem(storageCache, userVocabularyItems[1])
      await editUserVocabularyItem(storageCache, {
        ...userVocabularyItems[2],
        id: userVocabularyItems[1].id,
      })
      const updatedUserVocabulary = storageCache.getItem('userVocabulary')
      expect(updatedUserVocabulary).toHaveLength(1)
      expect({ ...userVocabularyItems[2], id: userVocabularyItems[1].id }).toEqual(updatedUserVocabulary[0])
    })

    it('should delete userVocabularyItem', async () => {
      await addUserVocabularyItem(storageCache, userVocabularyItems[0])
      const userVocabulary = storageCache.getItem('userVocabulary')
      expect(userVocabulary).toHaveLength(1)
      await deleteUserVocabularyItem(storageCache, userVocabularyItems[0])
      const updatedUserVocabulary = storageCache.getItem('userVocabulary')
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })

  describe('jobsWithPossiblyLostProgress', () => {
    it('should add job to jobsWithPossiblyLostProgress', async () => {
      expect(storageCache.getItem('jobsWithPossiblyLostProgress')).toHaveLength(0)
      await addJobWithPossiblyLostProgress(storageCache, 42)
      expect(storageCache.getItem('jobsWithPossiblyLostProgress')).toStrictEqual([42])
    })

    it('should remove job from jobsWithPossiblyLostProgress', async () => {
      await addJobWithPossiblyLostProgress(storageCache, 42)
      expect(storageCache.getItem('jobsWithPossiblyLostProgress')).toStrictEqual([42])
      await removeJobWithPossiblyLostProgress(storageCache, 42)
      expect(storageCache.getItem('jobsWithPossiblyLostProgress')).toHaveLength(0)
    })
  })
})
