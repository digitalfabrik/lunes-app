import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import { CheckCircleIcon, CheckCloseCircleIcon, CloseCircleIcon } from '../../assets/images'
import { StandardUnit } from '../models/Unit'
import VocabularyItem from '../models/VocabularyItem'
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
  [unitId: string]: { [exerciseKey: string]: number | undefined } | undefined
}

export type NextExercise = {
  unit: StandardUnit
  exerciseKey: number
}

export type NextExerciseData = NextExercise & {
  vocabularyItems: VocabularyItem[]
  jobTitle: string
}

export const BUTTONS_THEME = {
  outlined: 'outlined',
  contained: 'contained',
  text: 'text',
} as const

export type ButtonTheme = (typeof BUTTONS_THEME)[keyof typeof BUTTONS_THEME]

export type ArticleType = {
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

export type ArticleTypeExtended = {
  readonly label: string
} & ArticleType

export const getArticleWithLabel = (): ArticleTypeExtended[] =>
  ARTICLES.filter(article => article.id !== 0).map(article => {
    if (article.id === 4) {
      return { ...article, label: `${article.value} (Plural)` }
    }
    return { ...article, label: article.value }
  })

export type Article = (typeof ARTICLES)[number]

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

export const VOCABULARY_ITEM_TYPES = {
  lunesStandard: 'lunes-standard',
  lunesProtected: 'lunes-protected',
  userCreated: 'user-created',
} as const
export type VocabularyItemType = (typeof VOCABULARY_ITEM_TYPES)[keyof typeof VOCABULARY_ITEM_TYPES]

export type Favorite = {
  id: number
  vocabularyItemType: VocabularyItemType
  apiKey?: string
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

export const numberOfMaxRetries = 3

export const SCORE_THRESHOLD_POSITIVE_FEEDBACK = 4
export const SCORE_THRESHOLD_UNLOCK = 2

export const enum EXERCISE_FEEDBACK {
  POSITIVE,
  NONE,
  NEGATIVE,
}
