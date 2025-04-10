import AsyncStorage from '@react-native-async-storage/async-storage'
import { unlink } from 'react-native-fs'

import { ExerciseKey, Favorite, VOCABULARY_ITEM_TYPES } from '../constants/data'
import { VocabularyItem } from '../constants/endpoints'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { RepetitionService } from './RepetitionService'
import { StorageCache } from './Storage'
import { calculateScore, vocabularyItemToFavorite } from './helpers'

const FAVORITES_KEY = 'favorites'
const FAVORITES_KEY_2 = 'favorites-2'
const USER_VOCABULARY = 'userVocabulary'
const USER_VOCABULARY_NEXT_ID = 'userVocabularyNextId'

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

export const setFavorites = async (favorites: Favorite[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY_2, JSON.stringify(favorites))
}

const compareFavorites = (favorite1: Favorite, favorite2: Favorite) =>
  favorite1.id === favorite2.id && favorite1.vocabularyItemType === favorite2.vocabularyItemType

const migrateToNewFavoriteFormat = async (): Promise<void> => {
  const vocabularyItems = await AsyncStorage.getItem(FAVORITES_KEY)
  const parsedVocabularyItems = vocabularyItems ? JSON.parse(vocabularyItems) : []
  if (parsedVocabularyItems.length === 0) {
    return
  }
  await setFavorites(
    parsedVocabularyItems.map((item: number) => ({
      id: item,
      vocabularyItemType: VOCABULARY_ITEM_TYPES.lunesStandard,
    })),
  )
  await AsyncStorage.removeItem(FAVORITES_KEY)
}

export const getFavorites = async (): Promise<Favorite[]> => {
  await migrateToNewFavoriteFormat()
  const favorites = await AsyncStorage.getItem(FAVORITES_KEY_2)
  return favorites ? JSON.parse(favorites) : []
}

export const addFavorite = async (
  repetitionService: RepetitionService,
  vocabularyItem: VocabularyItem,
): Promise<void> => {
  const favorite = vocabularyItemToFavorite(vocabularyItem)
  const favorites = await getFavorites()
  if (favorites.includes(favorite)) {
    return
  }

  await repetitionService.addWordToFirstSection(vocabularyItem)
  const newFavorites = [...favorites, favorite]
  await setFavorites(newFavorites)
}

export const removeFavorite = async (favorite: Favorite): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = favorites.filter(it => !compareFavorites(it, favorite))
  await setFavorites(newFavorites)
}

export const isFavorite = async (favorite: Favorite): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.some(it => compareFavorites(it, favorite))
}

export const getNextUserVocabularyId = async (): Promise<number> =>
  parseInt((await AsyncStorage.getItem(USER_VOCABULARY_NEXT_ID)) ?? '1', 10)

export const incrementNextUserVocabularyId = async (): Promise<void> => {
  const nextId = (await getNextUserVocabularyId()) + 1
  return AsyncStorage.setItem(USER_VOCABULARY_NEXT_ID, nextId.toString())
}

export const getUserVocabularyItems = async (): Promise<VocabularyItem[]> => {
  const userVocabulary = await AsyncStorage.getItem(USER_VOCABULARY)
  return userVocabulary
    ? JSON.parse(userVocabulary).map((userVocabulary: VocabularyItem) => ({
        ...userVocabulary,
        type: VOCABULARY_ITEM_TYPES.userCreated,
      }))
    : []
}

export const setUserVocabularyItems = async (userVocabularyItems: VocabularyItem[]): Promise<void> => {
  await AsyncStorage.setItem(USER_VOCABULARY, JSON.stringify(userVocabularyItems))
}

export const addUserVocabularyItem = async (vocabularyItem: VocabularyItem): Promise<void> => {
  const userVocabulary = await getUserVocabularyItems()
  if (userVocabulary.find(item => item.word === vocabularyItem.word)) {
    return
  }
  await setUserVocabularyItems([...userVocabulary, vocabularyItem])
}

export const editUserVocabularyItem = async (
  oldUserVocabularyItem: VocabularyItem,
  newUserVocabularyItem: VocabularyItem,
): Promise<boolean> => {
  const userVocabulary = await getUserVocabularyItems()
  const index = userVocabulary.findIndex(item => JSON.stringify(item) === JSON.stringify(oldUserVocabularyItem))
  if (index === -1) {
    return false
  }
  userVocabulary[index] = newUserVocabularyItem
  await setUserVocabularyItems(userVocabulary)
  return true
}

export const deleteUserVocabularyItem = async (userVocabularyItem: VocabularyItem): Promise<void> => {
  const userVocabulary = await getUserVocabularyItems().then(vocab =>
    vocab.filter(item => JSON.stringify(item) !== JSON.stringify(userVocabularyItem)),
  )
  const images = userVocabularyItem.images.map(image => image.image)
  await Promise.all(
    images.map(async image => {
      await unlink(image)
    }),
  )
  await removeFavorite({ id: userVocabularyItem.id, vocabularyItemType: VOCABULARY_ITEM_TYPES.userCreated })
  await setUserVocabularyItems(userVocabulary)
}
