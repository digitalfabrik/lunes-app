import {
  Article,
  EXERCISES,
  exercisesWithoutProgress,
  exercisesWithProgress,
  NextExercise,
  Progress
} from '../constants/data'
import { AlternativeWord, Discipline, Document } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { loadDisciplines } from '../hooks/useLoadDisciplines'
import AsyncStorage from './AsyncStorage'

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

export const childrenLabel = (discipline: Discipline): string => {
  const isSingular = discipline.numberOfChildren === 1
  if (!discipline.parentTitle && !discipline.apiKey) {
    return isSingular ? labels.general.rootDiscipline : labels.general.rootDisciplines
  }
  if (discipline.isLeaf) {
    return isSingular ? labels.general.word : labels.general.words
  }
  return isSingular ? labels.general.discipline : labels.general.disciplines
}

export const childrenDescription = (discipline: Discipline): string =>
  `${discipline.numberOfChildren} ${childrenLabel(discipline)}`

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const doneExercisesOfLeafDiscipline = (disciplineId: number, progress: Progress): number => {
  const progressOfDiscipline = progress[disciplineId]
  return progressOfDiscipline
    ? Object.keys(progressOfDiscipline).filter(item => progressOfDiscipline[item] !== undefined).length
    : 0
}
/*
  Calculates the next exercise that needs to be done for a profession (= second level discipline of lunes standard vocabulary)
  returns
  disciplineId: the leaf discipline which needs to be done next
  exerciseKey: exerciseKey of the next exercise which needs to be done
  */
export const getNextExercise = async (profession: Discipline | null): Promise<NextExercise | null> => {
  if (!profession) {
    return null
  }
  const disciplines = await loadDisciplines({ parent: profession }) // TODO LUN-316 leaf disciplines must be loaded, also if nested
  if (disciplines.length <= 0) {
    throw new Error(`No Disciplines for id ${profession.id}`)
  }
  const progress = await AsyncStorage.getExerciseProgress()
  const firstUnfinishedDiscipline = disciplines.find(
    discipline => doneExercisesOfLeafDiscipline(discipline.id, progress) < exercisesWithProgress
  )

  if (!firstUnfinishedDiscipline) {
    return {
      disciplineId: disciplines[0].id,
      exerciseKey: exercisesWithoutProgress,
      disciplineTitle: disciplines[0].title
    } // TODO LUN-319 show success that every exercise is done
  }
  const disciplineProgress = progress[firstUnfinishedDiscipline.id]
  if (!disciplineProgress) {
    return {
      disciplineId: firstUnfinishedDiscipline.id,
      exerciseKey: exercisesWithoutProgress,
      disciplineTitle: firstUnfinishedDiscipline.title
    }
  }
  const nextExerciseKey = EXERCISES.slice(exercisesWithoutProgress).find(
    exercise => disciplineProgress[exercise.key] === undefined
  )
  return {
    disciplineId: firstUnfinishedDiscipline.id,
    exerciseKey: nextExerciseKey?.key ?? exercisesWithoutProgress,
    disciplineTitle: firstUnfinishedDiscipline.title
  }
}

export const getProgress = async (profession: Discipline | null): Promise<number> => {
  if (!profession || !profession.leafDisciplines) {
    return 0
  }
  const progress = await AsyncStorage.getExerciseProgress()
  const doneExercises = profession.leafDisciplines.reduce(
    (acc, leaf) => acc + doneExercisesOfLeafDiscipline(leaf, progress),
    0
  )
  const totalExercises = profession.leafDisciplines.length * exercisesWithProgress
  return doneExercises / totalExercises
}
