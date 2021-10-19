import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKeyType } from '../constants/data'
import { DocumentsType } from '../constants/endpoints'
import { DocumentResultType } from '../navigation/NavigationTypes'

const SESSION_KEY = 'session'

export interface ExerciseType {
  [disciplineId: number]: {
    [word: string]: DocumentResultType
  }
}

interface sessionData {
  id: number
  title: string
  numberOfWords: number
  exercise: number
  retryData?: { data: DocumentsType }
  results: []
}

export const getCustomDisciplines = async (): Promise<string[]> => {
  const disciplines = await AsyncStorage.getItem('customDisciplines')
  return disciplines ? JSON.parse(disciplines) : null
}

export const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem('customDisciplines', JSON.stringify(customDisciplines))
}

export const setSession = async (session: sessionData): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const getSession = async (): Promise<sessionData | null> => {
  const sessionJson = await AsyncStorage.getItem(SESSION_KEY)
  return sessionJson === null ? null : JSON.parse(sessionJson)
}

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(SESSION_KEY)
}

export const setExercise = async (exerciseKey: ExerciseKeyType, exercise: ExerciseType): Promise<void> => {
  await AsyncStorage.setItem(exerciseKey.toString(), JSON.stringify(exercise))
}

export const getExercise = async (exerciseKey: ExerciseKeyType): Promise<ExerciseType | null> => {
  const exerciseJson = await AsyncStorage.getItem(exerciseKey.toString())
  return exerciseJson === null ? null : JSON.parse(exerciseJson)
}

export const clearExercise = async (exerciseKey: ExerciseKeyType): Promise<void> => {
  await AsyncStorage.removeItem(exerciseKey.toString())
}

export default {
  setSession,
  getSession,
  clearSession,
  setExercise,
  getExercise,
  clearExercise,
  getCustomDisciplines,
  setCustomDisciplines
}
