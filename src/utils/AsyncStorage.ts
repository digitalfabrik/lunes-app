import { DocumentsType } from '../constants/endpoints'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ExerciseKeyType } from '../constants/data'
import { DocumentResultType } from '../navigation/NavigationTypes'

const SESSION_KEY = 'session'

export interface SessionType {
  extraParams: {
    disciplineID: number
    disciplineTitle: string
    disciplineIcon: string
    trainingSetId: number
    trainingSet: string
    exercise: ExerciseKeyType
    exerciseDescription: string
    level: number
  }
  retryData?: { data: DocumentsType }
}

export interface ExerciseType {
  [disciplineTitle: string]: {
    [trainingSet: string]: {
      [word: string]: DocumentResultType
    }
  }
}

export const setSession = async (session: SessionType): Promise<void> => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const getSession = async (): Promise<SessionType | null> => {
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
  clearExercise
}
