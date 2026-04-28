import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import { TrainingSentences, TrainingSpeech } from '../../assets/images'
import { StandardUnit } from '../models/Unit'
import VocabularyItem, { VocabularyItemId } from '../models/VocabularyItem'
import labels from './labels.json'

export const ExerciseKeys = {
  vocabularyList: 'word_list',
  wordChoiceExercise: 'word_choice',
} as const
export type ExerciseKey = (typeof ExerciseKeys)[keyof typeof ExerciseKeys]

export const EXERCISE_FOR_REPETITION = ExerciseKeys.wordChoiceExercise

export type Exercise = {
  key: ExerciseKey
  title: string
  description: string
  level: number
  icon: ComponentType<SvgProps>
  screen: 'VocabularyList' | 'WordChoiceExercise'
}

export const EXERCISES: Record<ExerciseKey, Exercise> = {
  [ExerciseKeys.vocabularyList]: {
    key: ExerciseKeys.vocabularyList,
    title: labels.exercises.vocabularyList.title,
    description: labels.exercises.vocabularyList.description,
    level: 0,
    icon: TrainingSentences,
    screen: 'VocabularyList',
  },
  [ExerciseKeys.wordChoiceExercise]: {
    key: ExerciseKeys.wordChoiceExercise,
    title: labels.exercises.wordChoice.title,
    description: labels.exercises.wordChoice.description,
    level: 1,
    icon: TrainingSpeech,
    screen: 'WordChoiceExercise',
  },
}

export type Progress = {
  [unitId: string]: { [exerciseKey: string]: number | undefined } | undefined
}

export type NextExercise = {
  unit: StandardUnit
  exerciseKey: ExerciseKey
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

export const ARTICLES = [
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

export const isArticlePlural = (article: ArticleType): boolean => article.id === 4

export const getArticleWithLabel = (): ArticleTypeExtended[] =>
  ARTICLES.filter(article => article.id !== 0).map(article => {
    if (isArticlePlural(article)) {
      return { ...article, label: `${article.value} (Plural)` }
    }
    return { ...article, label: article.value }
  })

export type Article = (typeof ARTICLES)[number]

export const SIMPLE_RESULTS = {
  correct: 'correct',
  incorrect: 'incorrect',
} as const
export type SimpleResult = (typeof SIMPLE_RESULTS)[keyof typeof SIMPLE_RESULTS]

export type Favorite = VocabularyItemId

export type Answer = {
  word: string
  article: Article
}

export const NUMBER_OF_MAX_RETRIES = 3

export const SCORE_THRESHOLD_POSITIVE_FEEDBACK = 4
export const SCORE_THRESHOLD_UNLOCK = 2

export const enum EXERCISE_FEEDBACK {
  POSITIVE,
  NONE,
  NEGATIVE,
}

export const MAX_TRAINING_REPETITIONS = 15
