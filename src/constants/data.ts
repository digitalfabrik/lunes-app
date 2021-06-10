import {
  easy,
  mideasy,
  midhard,
  hard,
  CorrectEntriesIcon,
  IncorrectEntriesIcon,
  AlmostCorrectEntriesIcon
} from '../../assets/images'
import { RoutesParamsType } from '../navigation/NavigationTypes'

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
    title: 'Vokabelübersicht',
    description: 'Alle Wörte anschauen',
    Level: easy,
    nextScreen: 'VocabularyOverview'
  },
  {
    key: ExerciseKeys.singleChoice,
    title: 'Wort auswählen',
    description: 'Wähle das richtige Wort',
    Level: mideasy,
    nextScreen: 'SingleChoice'
  },
  {
    key: ExerciseKeys.learnArticles,
    title: 'Artikel üben',
    description: 'Wähle den richtigen Artikel',
    Level: midhard,
    nextScreen: 'LearnArticles'
  },
  {
    key: ExerciseKeys.vocabularyTrainer,
    title: 'Wort schreiben',
    description: 'Wort mit Artikel eingeben',
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
  diePlural: 'die'
} as const

export type Article = typeof ARTICLES[keyof typeof ARTICLES]

export type SimpleResultType = 'correct' | 'incorrect' | 'similar'

export interface ResultType {
  key: SimpleResultType
  title: string
  Icon: number
  order: number
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
