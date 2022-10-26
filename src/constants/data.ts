import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import { CheckCloseCircleIcon, CheckCircleIcon, CloseCircleIcon } from '../../assets/images'
import { RoutesParams } from '../navigation/NavigationTypes'
import { VocabularyItem } from './endpoints'
import labels from './labels.json'

export const ExerciseKeys = {
  vocabularyList: 0,
  wordChoiceExercise: 1,
  articleChoiceExercise: 2,
  writeExercise: 3,
} as const
export type ExerciseKey = typeof ExerciseKeys[keyof typeof ExerciseKeys]

export interface Exercise {
  key: ExerciseKey
  title: string
  description: string
  level: number
  screen: keyof RoutesParams
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

export interface Progress {
  [disciplineId: string]: { [exerciseKey: string]: number | undefined } | undefined
}

export interface NextExercise {
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

export type ButtonTheme = typeof BUTTONS_THEME[keyof typeof BUTTONS_THEME]

export interface ArticleType {
  readonly id: number
  readonly value: string
}

export const ARTICLES: Readonly<ArticleType[]> = [
  {
    id: 0,
    value: 'keiner',
  },
  {
    id: 1,
    value: 'der',
  },
  {
    id: 2,
    value: 'die',
  },
  {
    id: 3,
    value: 'das',
  },
  {
    id: 4,
    value: 'die',
  },
] as const

interface ArticleTypeExtended extends ArticleType {
  readonly label: string
}

export const getArticleWithLabel = (): ArticleTypeExtended[] =>
  ARTICLES.filter(article => article.id !== 0).map(article => {
    if (article.id === 4) {
      return { ...article, label: `${article.value} (Plural)` }
    }
    return { ...article, label: article.value }
  })

export type Article = typeof ARTICLES[number]

export const SIMPLE_RESULTS = { correct: 'correct', incorrect: 'incorrect', similar: 'similar' } as const
export type SimpleResult = typeof SIMPLE_RESULTS[keyof typeof SIMPLE_RESULTS]

interface ResultType {
  key: SimpleResult
  title: string
  Icon: ComponentType<SvgProps>
  order: number
}

export const VOCABULARY_ITEM_TYPES = {
  lunesStandard: 'lunes-standard',
  lunesProtected: 'lunes-protected',
  userCreated: 'user-created',
}
export type VocabularyItemType = typeof VOCABULARY_ITEM_TYPES[keyof typeof VOCABULARY_ITEM_TYPES]

export interface Favorite {
  id: number
  vocabularyItemType: VocabularyItemType
  apiKey?: string
}

export interface Answer {
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

export type Result = typeof RESULTS[number]

export const FeedbackType = {
  discipline: 'discipline',
  leaf_discipline: 'trainingset',
  vocabularyItem: 'document',
} as const
export type FeedbackType = typeof FeedbackType[keyof typeof FeedbackType]

export const numberOfMaxRetries = 3

export const SCORE_THRESHOLD_POSITIVE_FEEDBACK = 4
export const SCORE_THRESHOLD_UNLOCK = 2

export const enum EXERCISE_FEEDBACK {
  POSITIVE,
  NONE,
  NEGATIVE,
}
