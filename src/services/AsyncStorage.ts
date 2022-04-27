import AsyncStorage from '@react-native-async-storage/async-storage'

import { ExerciseKey, Progress } from '../constants/data'
import { Discipline } from '../constants/endpoints'
import { DocumentResult } from '../navigation/NavigationTypes'

const progressKey = 'progress'

// return value of null means the selected profession was never set before, therefore the intro screen must be shown
export const getSelectedProfessions = async (): Promise<Discipline[] | null> => {
  const professions = await AsyncStorage.getItem('selectedProfessions')
  return professions ? JSON.parse(professions) : null
}

export const setSelectedProfessions = async (selectedProfessions: Discipline[]): Promise<void> => {
  await AsyncStorage.setItem('selectedProfessions', JSON.stringify(selectedProfessions))
}

export const pushSelectedProfession = async (profession: Discipline): Promise<Discipline[]> => {
  let professions = await getSelectedProfessions()
  if (professions === null) {
    professions = [profession]
  } else {
    professions.push(profession)
  }
  await setSelectedProfessions(professions)
  return professions
}

export const removeSelectedProfession = async (profession: Discipline): Promise<Discipline[]> => {
  const professions = await getSelectedProfessions()
  if (professions === null) {
    throw new Error('professions not set')
  }
  const index = professions.findIndex(item => item.id === profession.id)
  if (index === -1) {
    return professions
  }
  professions.splice(index, 1)
  await setSelectedProfessions(professions)
  return professions
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

export const getExerciseProgress = async (): Promise<Progress[]> => {
  const progress = await AsyncStorage.getItem(progressKey)
  return progress ? JSON.parse(progress) : []
}

const setExerciseProgress = async (disciplineId: number, exerciseKey: ExerciseKey, score: number): Promise<void> => {
  const savedProgress = await getExerciseProgress()
  const disciplineProgress = savedProgress.find(item => item.disciplineId === disciplineId)
  if (disciplineProgress) {
    const indexOfCurrent = disciplineProgress.exerciseProgress.findIndex(item => item.exerciseKey === exerciseKey)
    if (indexOfCurrent === -1) {
      disciplineProgress.exerciseProgress.push({ exerciseKey, score })
    } else if (disciplineProgress.exerciseProgress[indexOfCurrent].score < score) {
      disciplineProgress.exerciseProgress[indexOfCurrent] = { exerciseKey, score }
    }
  } else {
    savedProgress.push({ disciplineId, exerciseProgress: [{ exerciseKey, score }] })
  }
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

export const getProgress = async (profession: Discipline): Promise<number> => {
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
