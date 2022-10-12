import AsyncStorage from '@react-native-async-storage/async-storage'

import { DOCUMENT_TYPES, ExerciseKey, Favorite, Progress } from '../constants/data'
import { Document } from '../constants/endpoints'
import { DocumentResult } from '../navigation/NavigationTypes'
import { CMS, productionCMS, testCMS } from './axios'
import { calculateScore } from './helpers'

const SELECTED_PROFESSIONS_KEY = 'selectedProfessions'
const CUSTOM_DISCIPLINES_KEY = 'customDisciplines'
const FAVORITES_KEY = 'favorites'
const FAVORITES_KEY_2 = 'favorites-2'
const PROGRESS_KEY = 'progress'
const SENTRY_KEY = 'sentryTracking'
const CMS_KEY = 'cms'
const DEV_MODE_KEY = 'devmode'
const USER_VOCABULARY = 'userVocabulary'

export const isTrackingEnabled = async (): Promise<boolean> => {
  const tracking = await AsyncStorage.getItem(SENTRY_KEY)
  return tracking ? JSON.parse(tracking) : true
}

export const setIsTrackingEnabled = async (trackingEnabled: boolean): Promise<void> => {
  await AsyncStorage.setItem(SENTRY_KEY, JSON.stringify(trackingEnabled))
}

// return value of null means the selected profession was never set before, therefore the intro screen must be shown
export const getSelectedProfessions = async (): Promise<number[] | null> => {
  const professions = await AsyncStorage.getItem(SELECTED_PROFESSIONS_KEY)
  return professions ? JSON.parse(professions) : null
}

export const setSelectedProfessions = async (selectedProfessions: number[]): Promise<void> => {
  await AsyncStorage.setItem(SELECTED_PROFESSIONS_KEY, JSON.stringify(selectedProfessions))
}

export const pushSelectedProfession = async (professionId: number): Promise<number[]> => {
  let professions = await getSelectedProfessions()
  if (professions === null) {
    professions = [professionId]
  } else {
    professions.push(professionId)
  }
  await setSelectedProfessions(professions)
  return professions
}

export const removeSelectedProfession = async (professionId: number): Promise<number[]> => {
  const professions = await getSelectedProfessions()
  if (professions === null) {
    throw new Error('professions not set')
  }
  const updatedProfessions = professions.filter(item => item !== professionId)
  await setSelectedProfessions(updatedProfessions)
  return updatedProfessions
}

export const getCustomDisciplines = async (): Promise<string[]> => {
  const disciplines = await AsyncStorage.getItem(CUSTOM_DISCIPLINES_KEY)
  return disciplines ? JSON.parse(disciplines) : []
}

export const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem(CUSTOM_DISCIPLINES_KEY, JSON.stringify(customDisciplines))
}

export const removeCustomDiscipline = async (customDiscipline: string): Promise<void> => {
  const disciplines = await getCustomDisciplines()
  const index = disciplines.indexOf(customDiscipline)
  if (index === -1) {
    throw new Error('customDiscipline not available')
  }
  disciplines.splice(index, 1)
  await setCustomDisciplines(disciplines)
}

export const getExerciseProgress = async (): Promise<Progress> => {
  const progress = await AsyncStorage.getItem(PROGRESS_KEY)
  return progress ? JSON.parse(progress) : {}
}

export const setExerciseProgress = async (
  disciplineId: number,
  exerciseKey: ExerciseKey,
  score: number
): Promise<void> => {
  const savedProgress = await getExerciseProgress()
  const newScore = Math.max(savedProgress[disciplineId]?.[exerciseKey] ?? score, score)
  savedProgress[disciplineId] = { ...(savedProgress[disciplineId] ?? {}), [exerciseKey]: newScore }
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(savedProgress))
}

export const saveExerciseProgress = async (
  disciplineId: number,
  exerciseKey: ExerciseKey,
  documentsWithResults: DocumentResult[]
): Promise<void> => {
  const score = calculateScore(documentsWithResults)
  await setExerciseProgress(disciplineId, exerciseKey, score)
}

const migrateToNewFavoriteFormat = async (): Promise<void> => {
  const documents = await AsyncStorage.getItem(FAVORITES_KEY)
  const parsedDocuments = documents ? JSON.parse(documents) : []
  if (parsedDocuments.length === 0) {
    return
  }
  parsedDocuments.forEach((item: number) => {
    addFavorite({ id: item, documentType: DOCUMENT_TYPES.lunesStandard })
  })
  return
}

export const getFavorites = async (): Promise<Favorite[]> => {
  // await migrateToNewFavoriteFormat()
  const favorites = await AsyncStorage.getItem(FAVORITES_KEY_2)
  return favorites ? JSON.parse(favorites) : []
}

export const getFavoritesOld = async (): Promise<number[]> => {
  // await migrateToNewFavoriteFormat()
  const documents = await AsyncStorage.getItem(FAVORITES_KEY)
  return documents ? JSON.parse(documents) : []
}

export const setFavorites = async (favorites: Favorite[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY_2, JSON.stringify(favorites))
}

export const addFavorite = async (favorite: Favorite): Promise<void> => {
  console.log('Add', favorite)
  const favorites = await getFavorites()
  if (favorites.includes(favorite)) {
    return
  }
  const newFavorites = [...favorites, favorite]
  await setFavorites(newFavorites)
}

export const removeFavorite = async (favorite: Favorite): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = favorites.filter(it => it !== favorite)
  await setFavorites(newFavorites)
}

export const isFavorite = async (favorite: Favorite): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.some(item => item.id === favorite.id && item.documentType === favorite.documentType)
}

export const setOverwriteCMS = async (cms: CMS): Promise<void> => {
  await AsyncStorage.setItem(CMS_KEY, cms)
}

export const getOverwriteCMS = async (): Promise<CMS | null> => {
  const cms = await AsyncStorage.getItem(CMS_KEY)
  return cms === productionCMS || cms === testCMS ? cms : null
}

export const toggleDevMode = async (): Promise<void> => {
  const isDevMode = await AsyncStorage.getItem(DEV_MODE_KEY)
  await AsyncStorage.setItem(DEV_MODE_KEY, JSON.stringify(isDevMode ? !JSON.parse(isDevMode) : true))
}

export const getDevMode = async (): Promise<boolean | null> => {
  const isDevMode = await AsyncStorage.getItem(DEV_MODE_KEY)
  return isDevMode ? JSON.parse(isDevMode) : null
}

export const getUserVocabulary = async (): Promise<Document[]> => {
  const userVocabulary = await AsyncStorage.getItem(USER_VOCABULARY)
  return userVocabulary ? JSON.parse(userVocabulary) : []
}

export const setUserVocabulary = async (userDocument: Document[]): Promise<void> => {
  await AsyncStorage.setItem(USER_VOCABULARY, JSON.stringify(userDocument))
}

export const addUserDocument = async (userDocument: Document): Promise<void> => {
  const userVocabulary = await getUserVocabulary()
  if (userVocabulary.find(item => item.word === userDocument.word)) {
    return
  }
  await setUserVocabulary([...userVocabulary, userDocument])
}

export const editUserDocument = async (oldUserDocument: Document, newUserDocument: Document): Promise<boolean> => {
  const userVocabulary = await getUserVocabulary()
  const index = userVocabulary.findIndex(item => JSON.stringify(item) === JSON.stringify(oldUserDocument))
  if (index === -1) {
    return false
  }
  userVocabulary[index] = newUserDocument
  await setUserVocabulary(userVocabulary)
  return true
}

export const deleteUserDocument = async (userDocument: Document): Promise<void> => {
  const userVocabulary = getUserVocabulary().then(vocab =>
    vocab.filter(item => JSON.stringify(item) !== JSON.stringify(userDocument))
  )
  await removeFavorite({ id: userDocument.id, documentType: DOCUMENT_TYPES.userVocabulary })
  await setUserVocabulary(await userVocabulary)
}
