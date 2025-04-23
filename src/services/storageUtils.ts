import AsyncStorage from '@react-native-async-storage/async-storage'
import { unlink } from 'react-native-fs'

import { ExerciseKey, Favorite, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { UserVocabularyItem, VocabularyItem } from '../constants/endpoints'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { RepetitionService } from './RepetitionService'
import { getStorageItemOr, StorageCache } from './Storage'
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
}

const compareFavorites = (favorite1: Favorite, favorite2: Favorite) =>
  favorite1.id === favorite2.id && favorite1.vocabularyItemType === favorite2.vocabularyItemType

export const migrateToNewFavoriteFormat = async (storageCache: StorageCache): Promise<void> => {
  const parsedVocabularyItems = await getStorageItemOr<number[]>(FAVORITES_KEY_VERSION_0, [])
  if (parsedVocabularyItems.length === 0) {
    return
  }
  await storageCache.setItem(
    'favorites',
    parsedVocabularyItems.map((item: number) => ({
      id: item,
      vocabularyItemType: VOCABULARY_ITEM_TYPES.lunesStandard,
    })),
  )
  await AsyncStorage.removeItem(FAVORITES_KEY_VERSION_0)
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
