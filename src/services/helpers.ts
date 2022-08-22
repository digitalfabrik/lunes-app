import { AxiosResponse } from 'axios'

import { Article, EXERCISES, FeedbackType, NextExercise, Progress } from '../constants/data'
import { AlternativeWord, Discipline, Document, ENDPOINTS } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { ServerResponseDiscipline } from '../hooks/helpers'
import { loadDiscipline } from '../hooks/useLoadDiscipline'
import AsyncStorage from './AsyncStorage'
import { getFromEndpoint, postToEndpoint } from './axios'

export const stringifyDocument = ({ article, word }: Document | AlternativeWord): string => `${article.value} ${word}`

export const getArticleColor = (article: Article): string => {
  switch (article.id) {
    case 1:
      return COLORS.articleMasculine

    case 2:
      return COLORS.articleFeminine

    case 3:
      return COLORS.articleNeutral

    case 4:
      return COLORS.articlePlural

    default:
      return COLORS.articleMasculine
  }
}

export const moveToEnd = <T>(array: T[], index: number): T[] => {
  const currDocument = array[index]
  const newDocuments = array.filter(d => d !== currDocument)
  newDocuments.push(currDocument)
  return newDocuments
}

export const wordsDescription = (numberOfChildren: number): string =>
  `${numberOfChildren} ${numberOfChildren === 1 ? labels.general.word : labels.general.words}`

export const childrenLabel = (discipline: Discipline, hasParent = false): string => {
  const isSingular = discipline.numberOfChildren === 1
  if (!discipline.parentTitle && !discipline.apiKey && !hasParent) {
    return isSingular ? labels.general.rootDiscipline : labels.general.rootDisciplines
  }
  if (discipline.isLeaf) {
    return isSingular ? labels.general.word : labels.general.words
  }
  return isSingular ? labels.general.discipline : labels.general.disciplines
}

export const childrenDescription = (discipline: Discipline, hasParent = false): string =>
  `${discipline.numberOfChildren} ${childrenLabel(discipline, hasParent)}`

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getDoneExercisesByProgress = (disciplineId: number, progress: Progress): number => {
  const progressOfDiscipline = progress[disciplineId]
  return progressOfDiscipline
    ? Object.keys(progressOfDiscipline).filter(item => progressOfDiscipline[item] !== undefined).length
    : 0
}

export const getDoneExercises = (disciplineId: number): Promise<number> =>
  AsyncStorage.getExerciseProgress().then(progress => getDoneExercisesByProgress(disciplineId, progress))

/*
  Calculates the next exercise that needs to be done for a profession (= second level discipline of lunes standard vocabulary)
  returns
  disciplineId: the leaf discipline which needs to be done next
  exerciseKey: exerciseKey of the next exercise which needs to be done
  */
export const getNextExercise = async (profession: Discipline): Promise<NextExercise> => {
  const discipline = await loadDiscipline({ disciplineId: profession.id })
  const leafDisciplineIds = discipline.leafDisciplines
  if (!leafDisciplineIds?.length) {
    throw new Error(`No Disciplines for id ${profession.id}`)
  }
  const progress = await AsyncStorage.getExerciseProgress()
  const firstUnfinishedDisciplineId = leafDisciplineIds.find(
    id => getDoneExercisesByProgress(id, progress) < EXERCISES.length
  )

  if (!firstUnfinishedDisciplineId) {
    return {
      disciplineId: leafDisciplineIds[0],
      exerciseKey: 0,
    } // TODO LUN-319 show success that every exercise is done
  }
  const disciplineProgress = progress[firstUnfinishedDisciplineId]
  if (!disciplineProgress) {
    return {
      disciplineId: firstUnfinishedDisciplineId,
      exerciseKey: 0,
    }
  }
  const nextExerciseKey = EXERCISES.find(exercise => disciplineProgress[exercise.key] === undefined)
  return {
    disciplineId: firstUnfinishedDisciplineId,
    exerciseKey: nextExerciseKey?.key ?? 0,
  }
}

export const getProgress = async (profession: Discipline | null): Promise<number> => {
  if (!profession) {
    return 0
  }
  if (!profession.leafDisciplines) {
    return (await getDoneExercises(profession.id)) / EXERCISES.length
  }
  const progress = await AsyncStorage.getExerciseProgress()
  const doneExercises = profession.leafDisciplines.reduce(
    (acc, leaf) => acc + getDoneExercisesByProgress(leaf, progress),
    0
  )
  const totalExercises = profession.leafDisciplines.length * EXERCISES.length
  return doneExercises / totalExercises
}

export const loadTrainingsSet = async (disciplineId: number): Promise<ServerResponseDiscipline> => {
  const trainingSetUrl = `${ENDPOINTS.trainingSets}/${disciplineId}`
  const trainingSet = await getFromEndpoint<ServerResponseDiscipline>(trainingSetUrl)
  return trainingSet
}

export const getLabels = (): typeof labels => labels

export const sendFeedback = (comment: string, feedbackType: FeedbackType, id: number): Promise<AxiosResponse> =>
  postToEndpoint(ENDPOINTS.feedback, {
    comment,
    content_type: feedbackType,
    object_id: id,
  })
