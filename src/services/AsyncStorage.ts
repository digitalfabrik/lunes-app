import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKey, Progress } from '../constants/data'
import { Document } from '../constants/endpoints'
import { DocumentResult } from '../navigation/NavigationTypes'

const SELECTED_PROFESSIONS_KEY = 'selectedProfessions'
const CUSTOM_DISCIPLINES_KEY = 'customDisciplines'
const FAVORITES_KEY = 'favorites'
const PROGRESS_KEY = 'progress'

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

export const getExerciseProgress = async (): Promise<Progress> => {
  const progress = await AsyncStorage.getItem(PROGRESS_KEY)
  return progress ? JSON.parse(progress) : {}
}

const setExerciseProgress = async (disciplineId: number, exerciseKey: ExerciseKey, score: number): Promise<void> => {
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
  const score = documentsWithResults.filter(doc => doc.result === 'correct').length / documentsWithResults.length
  await setExerciseProgress(disciplineId, exerciseKey, score)
}

const getFavorites = async (): Promise<Document[]> => {
  const documents = await AsyncStorage.getItem(FAVORITES_KEY)
  return documents ? JSON.parse(documents) : []
}

const setFavorites = async (favorites: Document[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

const addFavorite = async (favorite: Document): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = [...favorites, favorite]
  await setFavorites(newFavorites)
}

const removeFavorite = async (favorite: Document): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = favorites.filter(it => it.id !== favorite.id)
  await setFavorites(newFavorites)
}

const isFavorite = async (favorite: Document): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.some(it => it.id === favorite.id)
}

export default {
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
  isFavorite
}
