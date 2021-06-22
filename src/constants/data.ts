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
  vocabularyOverview: 0,
  singleChoice: 1,
  learnArticles: 2,
  vocabularyTrainer: 3
}
export type ExerciseKeyType = typeof ExerciseKeys[keyof typeof ExerciseKeys]

export interface ExerciseType {
  key: ExerciseKeyType
  title: string
  description: string
  Level: easy
  nextScreen: keyof RoutesParamsType
}

export const EXERCISES: ExerciseType[] = [
  {
    key: ExerciseKeys.vocabularyOverview,
    title: labels.exercises.vocabularyList.title,
    description: labels.exercises.vocabularyList.description,
    Level: easy,
    nextScreen: 'VocabularyOverview'
  },
  {
    key: ExerciseKeys.singleChoice,
    title: labels.exercises.wordChoice.title,
    description: labels.exercises.wordChoice.description,
    Level: mideasy,
    nextScreen: 'SingleChoice'
  },
  {
    key: ExerciseKeys.learnArticles,
    title: labels.exercises.articleChoice.title,
    description: labels.exercises.articleChoice.description,
    Level: midhard,
    nextScreen: 'LearnArticles'
  },
  {
    key: ExerciseKeys.vocabularyTrainer,
    title: labels.exercises.write.title,
    description: labels.exercises.write.description,
    Level: hard,
    nextScreen: 'VocabularyTrainer'
  }
]

export const BUTTONS_THEME = {
  light: 'light',
  dark: 'dark'
}

export const ARTICLES = {
  die: 'die',
  der: 'der',
  das: 'das',
  diePlural: 'Die'
} as const

export type Article = typeof ARTICLES[keyof typeof ARTICLES]

export function isArticle(str: string): str is Article {
  const strArr: string[] = Object.values(ARTICLES)
  return strArr.includes(str)
}

export const SIMPLE_RESULTS = { correct: 'correct', incorrect: 'incorrect', similar: 'similar' } as const
export type SimpleResultType = typeof SIMPLE_RESULTS[keyof typeof SIMPLE_RESULTS]

export interface ResultType {
  key: SimpleResultType
  title: string
  Icon: number
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
