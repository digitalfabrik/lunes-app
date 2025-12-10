import AsyncStorage from '@react-native-async-storage/async-storage'
import { unlink } from 'react-native-fs'

import { ExerciseKey, Favorite, FIRST_EXERCISE_FOR_REPETITION } from '../constants/data'
import { StandardJobId } from '../models/Job'
import { StandardUnitId } from '../models/Unit'
import VocabularyItem, {
  areVocabularyItemIdsEqual,
  UserVocabularyId,
  UserVocabularyItem,
  VocabularyItemTypes,
} from '../models/VocabularyItem'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { RepetitionService } from './RepetitionService'
import { getStorageItem, getStorageItemOr, STORAGE_VERSION, StorageCache, storageKeys } from './Storage'
import { CMS_URLS } from './axios'
import { calculateScore } from './helpers'

export const FAVORITES_KEY_VERSION_0 = 'favorites'

export const pushSelectedJob = async (storageCache: StorageCache, { id }: StandardJobId): Promise<void> => {
  let jobs = storageCache.getMutableItem('selectedJobs')
  if (jobs === null) {
    jobs = [id]
  } else {
    jobs.push(id)
  }
  await storageCache.setItem('selectedJobs', jobs)
}

export const removeSelectedJob = async (storageCache: StorageCache, { id }: StandardJobId): Promise<number[]> => {
  const jobs = storageCache.getItem('selectedJobs')
  if (jobs === null) {
    throw new Error('professions not set')
  }
  const updatedJobs = jobs.filter(item => item !== id)
  await storageCache.setItem('selectedJobs', updatedJobs)
  return updatedJobs
}

export const removeCustomDiscipline = async (storageCache: StorageCache, customDiscipline: string): Promise<void> => {
  const customDisciplines = storageCache.getMutableItem('customDisciplines')
  const index = customDisciplines.indexOf(customDiscipline)
  if (index === -1) {
    throw new Error('customDiscipline not available')
  }
  customDisciplines.splice(index, 1)
  await storageCache.setItem('customDisciplines', customDisciplines)
}

export const setExerciseProgress = async (
  storageCache: StorageCache,
  unitId: StandardUnitId,
  exerciseKey: ExerciseKey,
  score: number,
): Promise<void> => {
  const savedProgress = storageCache.getMutableItem('progress')
  const newScore = Math.max(savedProgress[unitId.id]?.[exerciseKey] ?? score, score)
  savedProgress[unitId.id] = { ...(savedProgress[unitId.id] ?? {}), [exerciseKey]: newScore }
  await storageCache.setItem('progress', savedProgress)
}

export const saveExerciseProgress = async (
  storageCache: StorageCache,
  unitId: StandardUnitId,
  exerciseKey: ExerciseKey,
  vocabularyItemsWithResults: VocabularyItemResult[],
): Promise<void> => {
  const score = calculateScore(vocabularyItemsWithResults)
  await setExerciseProgress(storageCache, unitId, exerciseKey, score)

  if (exerciseKey >= FIRST_EXERCISE_FOR_REPETITION && score > 0) {
    const repetitionService = RepetitionService.fromStorageCache(storageCache)
    const words = vocabularyItemsWithResults.map(result => result.vocabularyItem)
    await repetitionService.addWordsToFirstSection(words)
  }
}

type Incomplete<T> = T & Record<string, unknown>

export const migrate0To1 = async (): Promise<void> => {
  const parsedFavorites = await getStorageItemOr<number[]>(FAVORITES_KEY_VERSION_0, [])
  if (parsedFavorites.length === 0) {
    return
  }
  await AsyncStorage.setItem(
    'favorites-2',
    JSON.stringify(
      parsedFavorites.map((item: number) => ({
        id: item,
        vocabularyItemType: VocabularyItemTypes.Standard,
      })),
    ),
  )
  await AsyncStorage.removeItem(FAVORITES_KEY_VERSION_0)
}

// Migrates the `images` field of `VocabularyItem` to a flat array of urls
export const migrate1To2 = async (): Promise<void> => {
  type OldVocabularyItem = Incomplete<{ images: { image: string }[] }>
  type OldWordNodeCard = Incomplete<{ word: OldVocabularyItem }>

  const updateVocabularyItem = (oldWord: OldVocabularyItem): Incomplete<{ images: string[] }> => ({
    ...oldWord,
    images: oldWord.images.map(image => image.image),
  })

  const oldUserVocabulary = await getStorageItemOr<OldVocabularyItem[]>('userVocabulary', [])
  const newUserVocabulary = oldUserVocabulary.map(updateVocabularyItem)
  await AsyncStorage.setItem('userVocabulary', JSON.stringify(newUserVocabulary))

  const oldWordNodeCards = await getStorageItemOr<OldWordNodeCard[]>('wordNodeCards', [])
  const newWordNodeCards = oldWordNodeCards.map(card => ({ ...card, word: updateVocabularyItem(card.word) }))
  await AsyncStorage.setItem('wordNodeCards', JSON.stringify(newWordNodeCards))
}

// Migrates `VocabularyItem`s to use the new id system
export const migrate2To3 = async (): Promise<void> => {
  const migrateUserVocabulary = async (): Promise<void> => {
    type OldUserVocabularyItem = Incomplete<{ id: number }>
    type NewUserVocabularyItem = Incomplete<{
      id: {
        type: 'user-created'
        index: number
      }
    }>

    const updateUserVocabularyItem = (oldItem: OldUserVocabularyItem): NewUserVocabularyItem => ({
      ...oldItem,
      id: { index: oldItem.id, type: 'user-created' },
    })

    const oldUserVocabulary = await getStorageItemOr<OldUserVocabularyItem[]>('userVocabulary', [])
    const newUserVocabulary = oldUserVocabulary.map(updateUserVocabularyItem)
    await AsyncStorage.setItem('userVocabulary', JSON.stringify(newUserVocabulary))
  }

  type OldVocabularyItemType = 'lunes-standard' | 'lunes-protected' | 'user-created'
  type NewVocabularyId =
    | {
        type: 'lunes-standard'
        id: number
      }
    | {
        type: 'user-created'
        index: number
      }
    | {
        type: 'lunes-protected'
        protectedId: number
        apiKey: string
      }
  type OldVocabularyItem = Incomplete<{ id: number; type: OldVocabularyItemType; apiKey?: string }>

  const getNewId = (oldItem: OldVocabularyItem): NewVocabularyId | null => {
    if (oldItem.type === 'lunes-standard') {
      return { type: 'lunes-standard', id: oldItem.id }
    }
    if (oldItem.type === 'user-created') {
      return { type: 'user-created', index: oldItem.id }
    }
    return oldItem.apiKey === undefined
      ? null
      : { type: 'lunes-protected', protectedId: oldItem.id, apiKey: oldItem.apiKey }
  }

  const migrateWordNodeCards = async (): Promise<void> => {
    type OldWordNodeCard = Incomplete<{
      word: OldVocabularyItem
    }>
    type NewWordNodeCard = Incomplete<{ word: Incomplete<{ id: NewVocabularyId }> }>

    const updateWordNodeCard = (oldWordNodeCard: OldWordNodeCard): NewWordNodeCard | null => {
      const newId = getNewId(oldWordNodeCard.word)
      if (newId === null) {
        return null
      }
      const { apiKey, type, ...newWord } = {
        ...oldWordNodeCard.word,
        id: newId,
      }
      return { ...oldWordNodeCard, word: newWord }
    }

    const oldWordNodeCards = await getStorageItemOr<OldWordNodeCard[]>('wordNodeCards', [])
    const newWordNodeCards = oldWordNodeCards.map(updateWordNodeCard)
    await AsyncStorage.setItem('wordNodeCards', JSON.stringify(newWordNodeCards))
  }

  const migrateFavorites = async (): Promise<void> => {
    type OldFavorite = {
      id: number
      vocabularyItemType: OldVocabularyItemType
      apiKey?: string
    }

    const oldFavorites = await getStorageItemOr<OldFavorite[]>('favorites-2', [])
    const newFavorites = oldFavorites
      .map(({ id, vocabularyItemType, apiKey }) => getNewId({ id, type: vocabularyItemType, apiKey }))
      .filter(it => it !== null)
    await AsyncStorage.setItem('favorites-2', JSON.stringify(newFavorites))
  }

  await migrateUserVocabulary()
  await migrateWordNodeCards()
  await migrateFavorites()
}

// Removes the cms url overwrite value in case it has changed between versions
export const migrateApiEndpointUrl = async (): Promise<void> => {
  const overwrite = await AsyncStorage.getItem(storageKeys.cmsUrlOverwrite)
  if (overwrite !== null && !(CMS_URLS as readonly string[]).includes(overwrite)) {
    await AsyncStorage.removeItem(storageKeys.cmsUrlOverwrite)
  }
}

export const migrateStorage = async (): Promise<void> => {
  const getStorageVersion = async (): Promise<number> => {
    const version = await getStorageItemOr<number | null>(storageKeys.version, null)
    if (version !== null) {
      return version
    }

    // If there is no version number stored yet,
    // this is either a new installation or an update from a version where this field did not exist yet.
    // In the former case, the storage version should be the latest version to avoid unnecessary startup work.
    // In the latter case, we should use 0 as the version number so that all migrations are run.
    // To differentiate between the two cases, we can use the fact that `selectedJobs` is null if and only if the startup screen was not completed yet.
    const selectedJobs = await getStorageItem('selectedJobs')
    return selectedJobs === null ? STORAGE_VERSION : 0
  }

  const lastVersion = await getStorageVersion()
  switch (lastVersion) {
    case 0:
      await migrate0To1()
    // eslint-disable-next-line no-fallthrough
    case 1:
      await migrate1To2()
    // eslint-disable-next-line no-fallthrough
    case 2:
      await migrate2To3()
      break
  }

  if (__DEV__) {
    await migrateApiEndpointUrl()
  }

  if (lastVersion !== STORAGE_VERSION) {
    await AsyncStorage.setItem(storageKeys.version, STORAGE_VERSION.toString())
  }
}

export const addFavorite = async (
  storageCache: StorageCache,
  repetitionService: RepetitionService,
  vocabularyItem: VocabularyItem,
): Promise<void> => {
  const favorite = vocabularyItem.id
  const favorites = storageCache.getItem('favorites')
  // TODO: This check seems incorrect, since it compares by identity
  if (favorites.includes(favorite)) {
    return
  }

  await repetitionService.addWordToFirstSection(vocabularyItem)
  const newFavorites = [...favorites, favorite]
  await storageCache.setItem('favorites', newFavorites)
}

export const removeFavorite = async (storageCache: StorageCache, favorite: Favorite): Promise<void> => {
  const favorites = storageCache.getItem('favorites')
  const newFavorites = favorites.filter(it => !areVocabularyItemIdsEqual(it, favorite))
  await storageCache.setItem('favorites', newFavorites)
}

export const isFavorite = (favorites: readonly Favorite[], favorite: Favorite): boolean =>
  favorites.some(it => areVocabularyItemIdsEqual(it, favorite))

export const incrementNextUserVocabularyId = async (storageCache: StorageCache): Promise<UserVocabularyId> => {
  const nextId = storageCache.getItem('nextUserVocabularyId')
  await storageCache.setItem('nextUserVocabularyId', nextId + 1)
  return { type: VocabularyItemTypes.UserCreated, index: nextId }
}

export const addUserVocabularyItem = async (
  storageCache: StorageCache,
  vocabularyItem: UserVocabularyItem,
): Promise<void> => {
  const userVocabulary = storageCache.getItem('userVocabulary')
  if (userVocabulary.find(item => item.word === vocabularyItem.word)) {
    return
  }
  await storageCache.setItem('userVocabulary', [...userVocabulary, vocabularyItem])
}

export const editUserVocabularyItem = async (
  storageCache: StorageCache,
  newUserVocabularyItem: UserVocabularyItem,
): Promise<void> => {
  const userVocabulary = storageCache.getMutableItem('userVocabulary')
  const index = userVocabulary.findIndex(item => areVocabularyItemIdsEqual(item.id, newUserVocabularyItem.id))
  if (index === -1) {
    return
  }
  userVocabulary[index] = newUserVocabularyItem
  await storageCache.setItem('userVocabulary', userVocabulary)
}

export const deleteUserVocabularyItem = async (
  storageCache: StorageCache,
  userVocabularyItem: UserVocabularyItem,
): Promise<void> => {
  const userVocabulary = storageCache
    .getItem('userVocabulary')
    .filter(item => !areVocabularyItemIdsEqual(item.id, userVocabularyItem.id))
  await Promise.all(
    userVocabularyItem.images.map(async image => {
      await unlink(image)
    }),
  )
  await removeFavorite(storageCache, userVocabularyItem.id)
  await RepetitionService.fromStorageCache(storageCache).removeWordNodeCard(userVocabularyItem)
  await storageCache.setItem('userVocabulary', userVocabulary)
}
