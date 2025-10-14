import { unlink } from 'react-native-fs'

import { ExerciseKey, Favorite, FIRST_EXERCISE_FOR_REPETITION } from '../constants/data'
import VocabularyItem, { UserVocabularyItem } from '../model/VocabularyItem'
import { areVocabularyItemRefsEqual, UserVocabularyItemRef } from '../model/VocabularyItemRef'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { RepetitionService } from './RepetitionService'
import { StorageCache } from './Storage'
import { calculateScore } from './helpers'

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
    const words = vocabularyItemsWithResults.map(result => result.vocabularyItem.ref)
    await repetitionService.addWordsToFirstSection(words)
  }
}

const compareFavorites = (favorite1: Favorite, favorite2: Favorite) => areVocabularyItemRefsEqual(favorite1, favorite2)

export const addFavorite = async (
  storageCache: StorageCache,
  repetitionService: RepetitionService,
  vocabularyItem: VocabularyItem,
): Promise<void> => {
  const favorites = storageCache.getItem('favorites')
  if (favorites.includes(vocabularyItem.ref)) {
    return
  }

  await repetitionService.addWordToFirstSection(vocabularyItem.ref)
  const newFavorites = [...favorites, vocabularyItem.ref]
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

export const getUserVocabularyItemByRef = (
  storageCache: StorageCache,
  ref: UserVocabularyItemRef,
): UserVocabularyItem | undefined => storageCache.getItem('userVocabulary').find(item => item.ref.id === ref.id)

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
  const index = userVocabulary.findIndex(item => areVocabularyItemRefsEqual(item.ref, newUserVocabularyItem.ref))
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
    .filter(item => !areVocabularyItemRefsEqual(item.ref, userVocabularyItem.ref))
  const images = userVocabularyItem.images
  await Promise.all(
    images.map(async image => {
      await unlink(image)
    }),
  )
  await removeFavorite(storageCache, userVocabularyItem.ref)
  await storageCache.setItem('userVocabulary', userVocabulary)
}
