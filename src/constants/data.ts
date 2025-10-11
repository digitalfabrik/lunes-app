import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import { CheckCloseCircleIcon, CheckCircleIcon, CloseCircleIcon } from '../../assets/images'
import Article from '../model/Article'
import VocabularyItem from '../model/VocabularyItem'
import VocabularyItemType from '../model/VocabularyItemType'
import labels from './labels.json'

export const ExerciseKeys = {
  vocabularyList: 0,
  wordChoiceExercise: 1,
  articleChoiceExercise: 2,
  writeExercise: 3,
} as const
export type ExerciseKey = (typeof ExerciseKeys)[keyof typeof ExerciseKeys]

export const FIRST_EXERCISE_FOR_REPETITION = ExerciseKeys.wordChoiceExercise

export type Exercise = {
  key: ExerciseKey
  title: string
  description: string
  level: number
  screen: 'VocabularyList' | 'WordChoiceExercise' | 'ArticleChoiceExercise' | 'WriteExercise'
}

export const EXERCISES: Readonly<Exercise[]> = [
  {
    key: ExerciseKeys.vocabularyList,
    title: labels.exercises.vocabularyList.title,
    description: labels.exercises.vocabularyList.description,
    level: 0,
    screen: 'VocabularyList',
  },
  {
    key: ExerciseKeys.wordChoiceExercise,
    title: labels.exercises.wordChoice.title,
    description: labels.exercises.wordChoice.description,
    level: 1,
    screen: 'WordChoiceExercise',
  },
  {
    key: ExerciseKeys.articleChoiceExercise,
    title: labels.exercises.articleChoice.title,
    description: labels.exercises.articleChoice.description,
    level: 2,
    screen: 'ArticleChoiceExercise',
  },
  {
    key: ExerciseKeys.writeExercise,
    title: labels.exercises.write.title,
    description: labels.exercises.write.description,
    level: 3,
    screen: 'WriteExercise',
  },
] as const

export type Progress = {
  [disciplineId: string]: { [exerciseKey: string]: number | undefined } | undefined
}

export type NextExercise = {
  disciplineId: number
  exerciseKey: number
}

export type NextExerciseData = NextExercise & {
  vocabularyItems: VocabularyItem[]
  title: string
}

export const BUTTONS_THEME = {
  outlined: 'outlined',
  contained: 'contained',
  text: 'text',
} as const

export type ButtonTheme = (typeof BUTTONS_THEME)[keyof typeof BUTTONS_THEME]

export const SIMPLE_RESULTS = {
  correct: 'correct',
  incorrect: 'incorrect',
  similar: 'similar',
} as const
export type SimpleResult = (typeof SIMPLE_RESULTS)[keyof typeof SIMPLE_RESULTS]

type ResultType = {
  key: SimpleResult
  title: string
  Icon: ComponentType<SvgProps>
  order: number
}

export type Favorite = {
  id: number
  vocabularyItemType: VocabularyItemType
}

export type Answer = {
  word: string
  article: Article
}

export const RESULTS: Readonly<ResultType[]> = [
  {
    key: 'correct',
    Icon: CheckCircleIcon,
    title: 'Richtige',
    order: 0,
  },
  {
    key: 'similar',
    Icon: CheckCloseCircleIcon,
    title: 'Fast richtige',
    order: 1,
  },
  {
    key: 'incorrect',
    Icon: CloseCircleIcon,
    title: 'Falsche',
    order: 2,
  },
] as const

export type Result = (typeof RESULTS)[number]

export const FeedbackType = {
  discipline: 'discipline',
  leaf_discipline: 'trainingset',
  vocabularyItem: 'document',
} as const
export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType]

export const numberOfMaxRetries = 3

export const SCORE_THRESHOLD_POSITIVE_FEEDBACK = 4
export const SCORE_THRESHOLD_UNLOCK = 2

export const enum EXERCISE_FEEDBACK {
  POSITIVE,
  NONE,
  NEGATIVE,
}
