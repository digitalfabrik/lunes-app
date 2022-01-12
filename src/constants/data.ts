import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import {
  AlmostCorrectEntriesIcon,
  CorrectEntriesIcon,
  easy,
  hard,
  IncorrectEntriesIcon,
  mideasy,
  midhard
} from '../../assets/images'
import { RoutesParamsType } from '../navigation/NavigationTypes'
import labels from './labels.json'

export const ExerciseKeys = {
  vocabularyList: 0,
  wordChoiceExercise: 1,
  articleChoiceExercise: 2,
  writeExercise: 3
}
export type ExerciseKeyType = typeof ExerciseKeys[keyof typeof ExerciseKeys]

export interface ExerciseType {
  key: ExerciseKeyType
  title: string
  description: string
  Level: typeof easy
  nextScreen: keyof RoutesParamsType
}

export const EXERCISES: ExerciseType[] = [
  {
    key: ExerciseKeys.vocabularyList,
    title: labels.exercises.vocabularyList.title,
    description: labels.exercises.vocabularyList.description,
    Level: easy,
    nextScreen: 'VocabularyList'
  },
  {
    key: ExerciseKeys.wordChoiceExercise,
    title: labels.exercises.wordChoice.title,
    description: labels.exercises.wordChoice.description,
    Level: mideasy,
    nextScreen: 'WordChoiceExercise'
  },
  {
    key: ExerciseKeys.articleChoiceExercise,
    title: labels.exercises.articleChoice.title,
    description: labels.exercises.articleChoice.description,
    Level: midhard,
    nextScreen: 'ArticleChoiceExercise'
  },
  {
    key: ExerciseKeys.writeExercise,
    title: labels.exercises.write.title,
    description: labels.exercises.write.description,
    Level: hard,
    nextScreen: 'WriteExercise'
  }
]

export const BUTTONS_THEME = {
  light: 'light',
  dark: 'dark',
  noOutline: 'no-outline'
} as const

export type ButtonThemeType = typeof BUTTONS_THEME[keyof typeof BUTTONS_THEME]

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
export type SimpleResultType = typeof SIMPLE_RESULTS[keyof typeof SIMPLE_RESULTS]

export interface ResultType {
  key: SimpleResultType
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
    Icon: CorrectEntriesIcon,
    title: 'Richtige',
    order: 0
  },
  {
    key: 'similar',
    Icon: AlmostCorrectEntriesIcon,
    title: 'Fast richtige',
    order: 1
  },
  {
    key: 'incorrect',
    Icon: IncorrectEntriesIcon,
    title: 'Falsche',
    order: 2
  }
]

export const numberOfMaxRetries = 3
