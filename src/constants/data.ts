import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import { CheckCloseCircleIcon, CheckCircleIcon, CloseCircleIcon } from '../../assets/images'
import { RoutesParams } from '../navigation/NavigationTypes'
import labels from './labels.json'

export const ExerciseKeys = {
  vocabularyList: 0,
  wordChoiceExercise: 1,
  articleChoiceExercise: 2,
  writeExercise: 3
}
export type ExerciseKey = typeof ExerciseKeys[keyof typeof ExerciseKeys]

export interface Exercise {
  key: ExerciseKey
  title: string
  description: string
  level: number
  screen: keyof RoutesParams
}

export const EXERCISES: Exercise[] = [
  {
    key: ExerciseKeys.vocabularyList,
    title: labels.exercises.vocabularyList.title,
    description: labels.exercises.vocabularyList.description,
    level: 0,
    screen: 'VocabularyList'
  },
  {
    key: ExerciseKeys.wordChoiceExercise,
    title: labels.exercises.wordChoice.title,
    description: labels.exercises.wordChoice.description,
    level: 1,
    screen: 'WordChoiceExercise'
  },
  {
    key: ExerciseKeys.articleChoiceExercise,
    title: labels.exercises.articleChoice.title,
    description: labels.exercises.articleChoice.description,
    level: 2,
    screen: 'ArticleChoiceExercise'
  },
  {
    key: ExerciseKeys.writeExercise,
    title: labels.exercises.write.title,
    description: labels.exercises.write.description,
    level: 3,
    screen: 'WriteExercise'
  }
]

export const exercisesWithoutProgress = 1
export const exercisesWithProgress = EXERCISES.length - exercisesWithoutProgress

export interface Progress {
  [disciplineId: string]: { [exerciseKey: string]: number | undefined } | undefined
}

export interface NextExercise {
  disciplineId: number
  exerciseKey: number
  disciplineTitle: string,
}

export const BUTTONS_THEME = {
  outlined: 'outlined',
  contained: 'contained',
  text: 'text'
} as const

export type ButtonTheme = typeof BUTTONS_THEME[keyof typeof BUTTONS_THEME]

interface ArticleType {
  readonly id: number
  readonly value: string
}

export const ARTICLES: ArticleType[] = [
  {
    id: 0,
    value: 'keiner'
  },
  {
    id: 1,
    value: 'Der'
  },
  {
    id: 2,
    value: 'Die'
  },
  {
    id: 3,
    value: 'Das'
  },
  {
    id: 4,
    value: 'Die'
  }
]

export type Article = typeof ARTICLES[number]

export const SIMPLE_RESULTS = { correct: 'correct', incorrect: 'incorrect', similar: 'similar' } as const
export type SimpleResult = typeof SIMPLE_RESULTS[keyof typeof SIMPLE_RESULTS]

interface ResultType {
  key: SimpleResult
  title: string
  Icon: ComponentType<SvgProps>
  order: number
}

export interface Answer {
  word: string
  article: Article
}

export const RESULTS: ResultType[] = [
  {
    key: 'correct',
    Icon: CheckCircleIcon,
    title: 'Richtige',
    order: 0
  },
  {
    key: 'similar',
    Icon: CheckCloseCircleIcon,
    title: 'Fast richtige',
    order: 1
  },
  {
    key: 'incorrect',
    Icon: CloseCircleIcon,
    title: 'Falsche',
    order: 2
  }
]

export type Result = typeof RESULTS[number]

export const numberOfMaxRetries = 3
