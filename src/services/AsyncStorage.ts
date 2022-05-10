import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKey, Progress } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { DocumentResult } from '../navigation/NavigationTypes'

const progressKey = 'progress'

// return value of null means the selected profession was never set before, therefore the intro screen must be shown
export const getSelectedProfessions = async (): Promise<number[] | null> => {
  const professions = await AsyncStorage.getItem('selectedProfessions')
  return professions ? JSON.parse(professions) : null
}

export const setSelectedProfessions = async (selectedProfessions: number[]): Promise<void> => {
  await AsyncStorage.setItem('selectedProfessions', JSON.stringify(selectedProfessions))
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
  const disciplines = await AsyncStorage.getItem('customDisciplines')
  return disciplines ? JSON.parse(disciplines) : []
}

export const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem('customDisciplines', JSON.stringify(customDisciplines))
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
  const progress = await AsyncStorage.getItem(progressKey)
  return progress ? JSON.parse(progress) : {}
}

const setExerciseProgress = async (disciplineId: number, exerciseKey: ExerciseKey, score: number): Promise<void> => {
  const savedProgress = await getExerciseProgress()
  const newScore = Math.max(savedProgress[disciplineId]?.[exerciseKey] ?? score, score)
  savedProgress[disciplineId] = { ...(savedProgress[disciplineId] ?? {}), [exerciseKey]: newScore }
  await AsyncStorage.setItem(progressKey, JSON.stringify(savedProgress))
}

export const saveExerciseProgress = async (
  disciplineId: number,
  exerciseKey: ExerciseKey,
  documentsWithResults: DocumentResult[]
): Promise<void> => {
  const score = documentsWithResults.filter(doc => doc.result === 'correct').length / documentsWithResults.length
  await setExerciseProgress(disciplineId, exerciseKey, score)
}

export const getProgress = async (profession: Discipline | null): Promise<number> => {
  if (!profession) {
    return 0
  }
  const progress = await AsyncStorage.getItem('progress')
  return progress === profession.title ? 1 : 1 // TODO LUN-290
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
  getProgress
}
