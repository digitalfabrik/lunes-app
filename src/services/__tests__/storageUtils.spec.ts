import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKeys, Favorite, Progress, SIMPLE_RESULTS } from '../../constants/data'
import VocabularyItem, { UserVocabularyItem, VocabularyItemTypes } from '../../models/VocabularyItem'
import { VocabularyItemResult } from '../../navigation/NavigationTypes'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import { mockJobs } from '../../testing/mockJob'
import { trackEvent } from '../AnalyticsService'
import { RepetitionService } from '../RepetitionService'
import { loadStorageCache, STORAGE_VERSION, StorageCache, storageKeys } from '../Storage'
import {
  addFavorite,
  addJobToNotMigrated,
  addUserVocabularyItem,
  deleteUserVocabularyItem,
  editUserVocabularyItem,
  FAVORITES_KEY_VERSION_0,
  getInstallationId,
  pushSelectedJob,
  removeCustomDiscipline,
  removeFavorite,
  removeJobFromNotMigrated,
  removeSelectedJob,
  saveExerciseProgress,
  setExerciseProgress,
} from '../storageUtils'

jest.mock('react-native-fs', () => ({
  unlink: jest.fn(),
}))

jest.mock('../AnalyticsService', () => ({
  trackEvent: jest.fn(),
  generateUniqueId: jest.fn(() => 'mock-installation-id'),
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
      await removeSelectedJob(storageCache, mockJobs()[0]!.id)
      expect(storageCache.getItem('selectedJobs')).toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await storageCache.setItem('selectedJobs', [mockJobs()[1]!.id.id])
      expect(storageCache.getItem('selectedJobs')).toHaveLength(1)
      await removeSelectedJob(storageCache, mockJobs()[0]!.id)
      expect(storageCache.getItem('selectedJobs')).toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await storageCache.setItem('selectedJobs', [mockJobs()[0]!.id.id])
      expect(storageCache.getItem('selectedJobs')).toHaveLength(1)
      await pushSelectedJob(storageCache, mockJobs()[1]!.id, mockJobs()[1]!.migrated)
      expect(storageCache.getItem('selectedJobs')).toHaveLength(2)
    })

    it('should emit a job_selected add event when pushing a job', async () => {
      await pushSelectedJob(storageCache, mockJobs()[0]!.id, mockJobs()[0]!.migrated)
      expect(jest.mocked(trackEvent)).toHaveBeenCalledWith(storageCache, {
        type: 'job_selected',
        job_id: mockJobs()[0]!.id.id,
        action: 'add',
      })
    })

    it('should emit a job_selected remove event when removing a job', async () => {
      await storageCache.setItem('selectedJobs', [mockJobs()[0]!.id.id])
      await removeSelectedJob(storageCache, mockJobs()[0]!.id)
      expect(jest.mocked(trackEvent)).toHaveBeenCalledWith(storageCache, {
        type: 'job_selected',
        job_id: mockJobs()[0]!.id.id,
        action: 'remove',
      })
    })

    it('should push selectedProfession to notMigratedSelectedJobs', async () => {
      await pushSelectedJob(storageCache, mockJobs()[0]!.id, mockJobs()[0]!.migrated)
      expect(storageCache.getItem('notMigratedSelectedJobs')).toStrictEqual([1])
    })

    it('should delete selectedProfession from notMigratedSelectedJobs', async () => {
      await pushSelectedJob(storageCache, mockJobs()[0]!.id, mockJobs()[0]!.migrated)
      expect(storageCache.getItem('notMigratedSelectedJobs')).toStrictEqual([1])
      await removeSelectedJob(storageCache, mockJobs()[0]!.id)
      expect(storageCache.getItem('notMigratedSelectedJobs')).toStrictEqual([])
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
        const progress = storageCache.getItem('progress')
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5 })
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
            vocabularyItem: vocabularyItems[0]!,
            result: SIMPLE_RESULTS.correct,
            numberOfTries: 1,
          },
          {
            vocabularyItem: vocabularyItems[0]!,
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
      await addFavorite(storageCache, repetitionService, vocabularyItems[2]!)
      expect(repetitionService.getWordNodeCards().map(wordNodeCard => wordNodeCard.wordId)).toStrictEqual([
        vocabularyItems[2]!.id,
      ])
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems.slice(0, 3))
      await addFavorite(storageCache, repetitionService, vocabularyItems[3]!)
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems)
      expect(repetitionService.getWordNodeCards().map(wordNodeCard => wordNodeCard.wordId)).toStrictEqual([
        vocabularyItems[2]!.id,
        vocabularyItems[3]!.id,
      ])
    })

    it('should remove favorites', async () => {
      await storageCache.setItem('favorites', favoriteItems)
      expect(storageCache.getItem('favorites')).toEqual(favoriteItems)
      await removeFavorite(storageCache, favoriteItems[2]!)
      expect(storageCache.getItem('favorites')).toEqual([favoriteItems[0]!, favoriteItems[1]!, favoriteItems[3]!])
      await removeFavorite(storageCache, favoriteItems[0]!)
      expect(storageCache.getItem('favorites')).toEqual([favoriteItems[1]!, favoriteItems[3]!])
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
        expect(storageCache.getItem('wordNodeCards')).toEqual([
          {
            section: 0,
            inThisSectionSince: new Date('2025-10-13').toISOString(),
            wordId: { type: VocabularyItemTypes.UserCreated, index: 2 },
          },
          {
            section: 0,
            inThisSectionSince: new Date('2025-10-13').toISOString(),
            wordId: { type: VocabularyItemTypes.Standard, id: 3 },
          },
          {
            section: 0,
            inThisSectionSince: new Date('2025-10-13').toISOString(),
            wordId: { type: VocabularyItemTypes.Protected, protectedId: 4, apiKey: 'abc123' },
          },
        ])
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
      it('should migrate notMigratedSelectedJobs', async () => {
        const selectedJobs = [1, 2, 3]
        await AsyncStorage.setItem(storageKeys.version, '3')
        await AsyncStorage.setItem(storageKeys.selectedJobs, JSON.stringify(selectedJobs))

        const storageCache = await loadStorageCache()
        expect(storageCache.getItem('notMigratedSelectedJobs')).toEqual(selectedJobs)
      })
    })

    describe('should migrate from v4', () => {
      it('should replace word with wordId in wordNodeCards', async () => {
        await AsyncStorage.setItem(storageKeys.version, '4')
        await AsyncStorage.setItem(
          'wordNodeCards',
          JSON.stringify([
            {
              word: {
                id: { type: VocabularyItemTypes.Standard, id: 1 },
                word: 'Spachtel',
                article: { id: 1, value: 'die' },
                images: ['image-1'],
                audio: null,
                alternatives: [],
              },
              section: 2,
              inThisSectionSince: new Date('2025-10-13'),
            },
            {
              word: {
                id: { type: VocabularyItemTypes.UserCreated, index: 5 },
                word: 'Hund',
                article: { id: 2, value: 'der' },
                images: [],
                audio: null,
                alternatives: [],
              },
              section: 0,
              inThisSectionSince: new Date('2025-11-01'),
            },
          ]),
        )

        const storageCache = await loadStorageCache()
        expect(storageCache.getItem('wordNodeCards')).toEqual([
          {
            section: 2,
            inThisSectionSince: new Date('2025-10-13').toISOString(),
            wordId: { type: VocabularyItemTypes.Standard, id: 1 },
          },
          {
            section: 0,
            inThisSectionSince: new Date('2025-11-01').toISOString(),
            wordId: { type: VocabularyItemTypes.UserCreated, index: 5 },
          },
        ])
      })
    })

    describe('should migrate from v5', () => {
      it('should rename exercise progress keys from integers to strings', async () => {
        await AsyncStorage.setItem(storageKeys.version, '5')
        await AsyncStorage.setItem('progress', JSON.stringify({ '1': { '0': 3, '1': 7 }, '2': { '0': 5 } }))

        const storageCache = await loadStorageCache()
        expect(storageCache.getItem('progress')).toEqual({
          '1': { [ExerciseKeys.vocabularyList]: 3, [ExerciseKeys.wordChoiceExercise]: 7 },
          '2': { [ExerciseKeys.vocabularyList]: 5 },
        })
      })
    })
  })

  describe('userVocabulary', () => {
    const userVocabularyItems = new VocabularyItemBuilder(3).buildUserVocabulary()

    it('should add userVocabularyItem', async () => {
      const userVocabulary = storageCache.getItem('userVocabulary')
      expect(userVocabulary).toHaveLength(0)
      await addUserVocabularyItem(storageCache, userVocabularyItems[0]!)
      const updatedUserVocabulary = storageCache.getItem('userVocabulary')
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userVocabularyItem', async () => {
      await addUserVocabularyItem(storageCache, userVocabularyItems[1]!)
      await editUserVocabularyItem(storageCache, {
        ...userVocabularyItems[2]!,
        id: userVocabularyItems[1]!.id,
      })
      const updatedUserVocabulary = storageCache.getItem('userVocabulary')
      expect(updatedUserVocabulary).toHaveLength(1)
      expect({ ...userVocabularyItems[2]!, id: userVocabularyItems[1]!.id }).toEqual(updatedUserVocabulary[0]!)
    })

    it('should delete userVocabularyItem', async () => {
      await addUserVocabularyItem(storageCache, userVocabularyItems[0]!)
      const userVocabulary = storageCache.getItem('userVocabulary')
      expect(userVocabulary).toHaveLength(1)
      await deleteUserVocabularyItem(storageCache, userVocabularyItems[0]!)
      const updatedUserVocabulary = storageCache.getItem('userVocabulary')
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })

  describe('notMigratedSelectedJobs', () => {
    it('should add job to notMigratedSelectedJobs', async () => {
      expect(storageCache.getItem('notMigratedSelectedJobs')).toHaveLength(0)
      await addJobToNotMigrated(storageCache, 42)
      expect(storageCache.getItem('notMigratedSelectedJobs')).toStrictEqual([42])
    })

    it('should remove job from notMigratedSelectedJobs', async () => {
      await addJobToNotMigrated(storageCache, 42)
      expect(storageCache.getItem('notMigratedSelectedJobs')).toStrictEqual([42])
      await removeJobFromNotMigrated(storageCache, 42)
      expect(storageCache.getItem('notMigratedSelectedJobs')).toHaveLength(0)
    })
  })

  describe('installationId', () => {
    it('should create an installation id', async () => {
      expect(storageCache.getItem('installationId')).toBeNull()
      await getInstallationId(storageCache)
      expect(storageCache.getItem('installationId')).not.toBeNull()
    })

    it('should not create an installation id if it already exists', async () => {
      const installationId = 'random-uuid'
      await storageCache.setItem('installationId', installationId)
      await expect(getInstallationId(storageCache)).resolves.toEqual(installationId)
      expect(storageCache.getItem('installationId')).toBe(installationId)
    })
  })
})
