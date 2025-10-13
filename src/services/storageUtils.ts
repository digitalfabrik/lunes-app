import AsyncStorage from '@react-native-async-storage/async-storage'
import { unlink } from 'react-native-fs'

import { ExerciseKey, Favorite, FIRST_EXERCISE_FOR_REPETITION, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { UserVocabularyItem, VocabularyItem } from '../constants/endpoints'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { RepetitionService } from './RepetitionService'
import { getStorageItem, getStorageItemOr, STORAGE_VERSION, StorageCache, storageKeys } from './Storage'
import { calculateScore, vocabularyItemToFavorite } from './helpers'

export const FAVORITES_KEY_VERSION_0 = 'favorites'

export const pushSelectedProfession = async (storageCache: StorageCache, professionId: number): Promise<void> => {
  let professions = storageCache.getMutableItem('selectedProfessions')
  if (professions === null) {
    professions = [professionId]
  } else {
    professions.push(professionId)
  }
  await storageCache.setItem('selectedProfessions', professions)
}

export const removeSelectedProfession = async (storageCache: StorageCache, professionId: number): Promise<number[]> => {
  const professions = storageCache.getItem('selectedProfessions')
  if (professions === null) {
    throw new Error('professions not set')
  }
  const updatedProfessions = professions.filter(item => item !== professionId)
  await storageCache.setItem('selectedProfessions', updatedProfessions)
  return updatedProfessions
}

export const removeCustomDiscipline = async (storageCache: StorageCache, customDiscipline: string): Promise<void> => {
  const disciplines = storageCache.getMutableItem('customDisciplines')
  const index = disciplines.indexOf(customDiscipline)
  if (index === -1) {
    throw new Error('customDiscipline not available')
  }
  disciplines.splice(index, 1)
  await storageCache.setItem('customDisciplines', disciplines)
}

export const setExerciseProgress = async (
  storageCache: StorageCache,
  disciplineId: number,
  exerciseKey: ExerciseKey,
  score: number,
): Promise<void> => {
  const savedProgress = storageCache.getMutableItem('progress')
  const newScore = Math.max(savedProgress[disciplineId]?.[exerciseKey] ?? score, score)
  savedProgress[disciplineId] = { ...(savedProgress[disciplineId] ?? {}), [exerciseKey]: newScore }
  await storageCache.setItem('progress', savedProgress)
}

export const saveExerciseProgress = async (
  storageCache: StorageCache,
  disciplineId: number,
  exerciseKey: ExerciseKey,
  vocabularyItemsWithResults: VocabularyItemResult[],
): Promise<void> => {
  const score = calculateScore(vocabularyItemsWithResults)
  await setExerciseProgress(storageCache, disciplineId, exerciseKey, score)

  if (exerciseKey >= FIRST_EXERCISE_FOR_REPETITION && score > 0) {
    const repetitionService = RepetitionService.fromStorageCache(storageCache)
    const words = vocabularyItemsWithResults.map(result => result.vocabularyItem)
    await repetitionService.addWordsToFirstSection(words)
  }
}

const compareFavorites = (favorite1: Favorite, favorite2: Favorite) =>
  favorite1.id === favorite2.id && favorite1.vocabularyItemType === favorite2.vocabularyItemType

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
        vocabularyItemType: 'lunes-standard',
      })),
    ),
  )
  await AsyncStorage.removeItem(FAVORITES_KEY_VERSION_0)
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
    // To differentiate between the two cases, we can use the fact that `selectedProfessions` is null if and only if the startup screen was not completed yet.
    const selectedProfessions = await getStorageItem('selectedProfessions')
    return selectedProfessions === null ? STORAGE_VERSION : 0
  }

  const lastVersion = await getStorageVersion()
  switch (lastVersion) {
    case 0:
      await migrate0To1()
      break
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
  const favorite = vocabularyItemToFavorite(vocabularyItem)
  const favorites = storageCache.getItem('favorites')
  if (favorites.includes(favorite)) {
    return
  }

  await repetitionService.addWordToFirstSection(vocabularyItem)
  const newFavorites = [...favorites, favorite]
  await storageCache.setItem('favorites', newFavorites)
}

export const removeFavorite = async (storageCache: StorageCache, favorite: Favorite): Promise<void> => {
  const favorites = storageCache.getItem('favorites')
  const newFavorites = favorites.filter(it => !compareFavorites(it, favorite))
  await storageCache.setItem('favorites', newFavorites)
}

export const isFavorite = (favorites: readonly Favorite[], favorite: Favorite): boolean =>
  favorites.some(it => compareFavorites(it, favorite))

export const incrementNextUserVocabularyId = async (storageCache: StorageCache): Promise<number> => {
  const nextId = storageCache.getItem('nextUserVocabularyId')
  await storageCache.setItem('nextUserVocabularyId', nextId + 1)
  return nextId
}

export const getUserVocabularyItems = (userVocabulary: readonly UserVocabularyItem[]): VocabularyItem[] =>
  userVocabulary.map((vocabularyItem: UserVocabularyItem) => ({
    ...vocabularyItem,
    type: VOCABULARY_ITEM_TYPES.userCreated,
  }))

export const addUserVocabularyItem = async (
  storageCache: StorageCache,
  vocabularyItem: VocabularyItem,
): Promise<void> => {
  const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
  if (userVocabulary.find(item => item.word === vocabularyItem.word)) {
    return
  }
  await storageCache.setItem('userVocabulary', [...userVocabulary, vocabularyItem])
}

export const editUserVocabularyItem = async (
  storageCache: StorageCache,
  oldUserVocabularyItem: VocabularyItem,
  newUserVocabularyItem: VocabularyItem,
): Promise<void> => {
  const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary'))
  const index = userVocabulary.findIndex(item => JSON.stringify(item) === JSON.stringify(oldUserVocabularyItem))
  if (index === -1) {
    return
  }
  userVocabulary[index] = newUserVocabularyItem
  await storageCache.setItem('userVocabulary', userVocabulary)
}

export const deleteUserVocabularyItem = async (
  storageCache: StorageCache,
  userVocabularyItem: VocabularyItem,
): Promise<void> => {
  const userVocabulary = getUserVocabularyItems(storageCache.getItem('userVocabulary')).filter(
    item => JSON.stringify(item) !== JSON.stringify(userVocabularyItem),
  )
  const images = userVocabularyItem.images.map(image => image.image)
  await Promise.all(
    images.map(async image => {
      await unlink(image)
    }),
  )
  await removeFavorite(storageCache, {
    id: userVocabularyItem.id,
    vocabularyItemType: VOCABULARY_ITEM_TYPES.userCreated,
  })
  await storageCache.setItem('userVocabulary', userVocabulary)
}
