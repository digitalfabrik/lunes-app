import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKey, Progress } from '../constants/data'
import { Document } from '../constants/endpoints'
import { DocumentResult } from '../navigation/NavigationTypes'
import { CMS, productionCMS, testCMS } from './axios'

const SELECTED_PROFESSIONS_KEY = 'selectedProfessions'
const CUSTOM_DISCIPLINES_KEY = 'customDisciplines'
const FAVORITES_KEY = 'favorites'
const PROGRESS_KEY = 'progress'
const SENTRY_KEY = 'sentryTracking'
const CMS_KEY = 'cms'
const DEV_MODE_KEY = 'devmode'
const USER_VOCABULARY = 'userVocabulary'

const isTrackingEnabled = async (): Promise<boolean> => {
  const tracking = await AsyncStorage.getItem(SENTRY_KEY)
  return tracking ? JSON.parse(tracking) : true
}

const setIsTrackingEnabled = async (trackingEnabled: boolean): Promise<void> => {
  await AsyncStorage.setItem(SENTRY_KEY, JSON.stringify(trackingEnabled))
}

// return value of null means the selected profession was never set before, therefore the intro screen must be shown
const getSelectedProfessions = async (): Promise<number[] | null> => {
  const professions = await AsyncStorage.getItem(SELECTED_PROFESSIONS_KEY)
  return professions ? JSON.parse(professions) : null
}

const setSelectedProfessions = async (selectedProfessions: number[]): Promise<void> => {
  await AsyncStorage.setItem(SELECTED_PROFESSIONS_KEY, JSON.stringify(selectedProfessions))
}

const pushSelectedProfession = async (professionId: number): Promise<number[]> => {
  let professions = await getSelectedProfessions()
  if (professions === null) {
    professions = [professionId]
  } else {
    professions.push(professionId)
  }
  await setSelectedProfessions(professions)
  return professions
}

const removeSelectedProfession = async (professionId: number): Promise<number[]> => {
  const professions = await getSelectedProfessions()
  if (professions === null) {
    throw new Error('professions not set')
  }
  const updatedProfessions = professions.filter(item => item !== professionId)
  await setSelectedProfessions(updatedProfessions)
  return updatedProfessions
}

const getCustomDisciplines = async (): Promise<string[]> => {
  const disciplines = await AsyncStorage.getItem(CUSTOM_DISCIPLINES_KEY)
  return disciplines ? JSON.parse(disciplines) : []
}

const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem(CUSTOM_DISCIPLINES_KEY, JSON.stringify(customDisciplines))
}

const removeCustomDiscipline = async (customDiscipline: string): Promise<void> => {
  const disciplines = await getCustomDisciplines()
  const index = disciplines.indexOf(customDiscipline)
  if (index === -1) {
    throw new Error('customDiscipline not available')
  }
  disciplines.splice(index, 1)
  await setCustomDisciplines(disciplines)
}

const getExerciseProgress = async (): Promise<Progress> => {
  const progress = await AsyncStorage.getItem(PROGRESS_KEY)
  return progress ? JSON.parse(progress) : {}
}

const setExerciseProgress = async (disciplineId: number, exerciseKey: ExerciseKey, score: number): Promise<void> => {
  const savedProgress = await getExerciseProgress()
  const newScore = Math.max(savedProgress[disciplineId]?.[exerciseKey] ?? score, score)
  savedProgress[disciplineId] = { ...(savedProgress[disciplineId] ?? {}), [exerciseKey]: newScore }
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(savedProgress))
}

const saveExerciseProgress = async (
  disciplineId: number,
  exerciseKey: ExerciseKey,
  documentsWithResults: DocumentResult[]
): Promise<void> => {
  const score = documentsWithResults.filter(doc => doc.result === 'correct').length / documentsWithResults.length
  await setExerciseProgress(disciplineId, exerciseKey, score)
}

const getFavorites = async (): Promise<number[]> => {
  const documents = await AsyncStorage.getItem(FAVORITES_KEY)
  return documents ? JSON.parse(documents) : []
}

const setFavorites = async (favorites: number[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

const addFavorite = async (favorite: number): Promise<void> => {
  const favorites = await getFavorites()
  if (favorites.includes(favorite)) {
    return
  }
  const newFavorites = [...favorites, favorite]
  await setFavorites(newFavorites)
}

const removeFavorite = async (favoriteId: number): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = favorites.filter(it => it !== favoriteId)
  await setFavorites(newFavorites)
}

const isFavorite = async (favoriteId: number): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.includes(favoriteId)
}

const setOverwriteCMS = async (cms: CMS): Promise<void> => {
  await AsyncStorage.setItem(CMS_KEY, cms)
}

const getOverwriteCMS = async (): Promise<CMS | null> => {
  const cms = await AsyncStorage.getItem(CMS_KEY)
  return cms === productionCMS || cms === testCMS ? cms : null
}

const toggleDevMode = async (): Promise<void> => {
  const isDevMode = await AsyncStorage.getItem(DEV_MODE_KEY)
  await AsyncStorage.setItem(DEV_MODE_KEY, JSON.stringify(isDevMode ? !JSON.parse(isDevMode) : true))
}

const getDevMode = async (): Promise<boolean | null> => {
  const isDevMode = await AsyncStorage.getItem(DEV_MODE_KEY)
  return isDevMode ? JSON.parse(isDevMode) : null
}

const getUserVocabulary = async (): Promise<Document[]> => {
  const userVocabulary = await AsyncStorage.getItem(USER_VOCABULARY)
  return userVocabulary ? JSON.parse(userVocabulary) : []
}

const setUserVocabulary = async (userDocument: Document[]): Promise<void> => {
  await AsyncStorage.setItem(USER_VOCABULARY, JSON.stringify(userDocument))
}

const addUserDocument = async (userDocument: Document): Promise<void> => {
  console.log('add: ', userDocument.word)
  const userVocabulary = await getUserVocabulary()
  await setUserVocabulary([...userVocabulary, userDocument])
}

const editUserDocument = async (oldUserDocument: Document, newUserDocument: Document): Promise<boolean> => {
  const userVocabulary = await getUserVocabulary()
  const index = userVocabulary.findIndex(item => JSON.stringify(item) === JSON.stringify(oldUserDocument))
  if (index === -1) {
    return false
  }
  userVocabulary[index] = newUserDocument
  await setUserVocabulary(userVocabulary)
  return true
}

const deleteUserDocument = async (userDocument: Document): Promise<void> => {
  console.log('delete')
  const userVocabulary = getUserVocabulary().then(vocab =>
    vocab.filter(item => JSON.stringify(item) !== JSON.stringify(userDocument))
  )
  await setUserVocabulary(await userVocabulary)
}

export default {
  isTrackingEnabled,
  setIsTrackingEnabled,
  getCustomDisciplines,
  setCustomDisciplines,
  removeCustomDiscipline,
  setSelectedProfessions,
  getSelectedProfessions,
  pushSelectedProfession,
  removeSelectedProfession,
  saveExerciseProgress,
  setExerciseProgress,
  getExerciseProgress,
  getFavorites,
  setFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  setOverwriteCMS,
  getOverwriteCMS,
  toggleDevMode,
  getDevMode,
  getUserVocabulary,
  addUserDocument,
  editUserDocument,
  deleteUserDocument,
}
