import { easy, mideasy, hard, CorrectEntriesIcon, IncorrectEntriesIcon, AlmostCorrectEntriesIcon } from '../../assets/images'
import { RoutesParamsType } from '../navigation/NavigationTypes'

export interface ExerciseType {
  id: number
  title: string
  description: string
  Level: easy
  nextScreen: keyof RoutesParamsType
}

export const EXERCISES: ExerciseType[] = [
  {
    id: 1,
    title: 'Vocabulary Overview',
    description: 'All Words',
    Level: easy,
    nextScreen: 'VocabularyOverview'
  },
  {
    id: 2,
    title: 'Single Choice',
    description: 'Words with Articles',
    Level: mideasy,
    nextScreen: 'SingleChoice'
  },
  {
    id: 3,
    title: 'Vocabulary Trainer',
    description: 'Write words with articles',
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
  diePlural: 'die (plural)'
}

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
    title: 'Correct',
    order: 0
  },
  {
    key: 'similar',
    Icon: AlmostCorrectEntriesIcon,
    title: 'Almost Correct',
    order: 1
  },
  {
    key: 'incorrect',
    Icon: IncorrectEntriesIcon,
    title: 'Incorrect',
    order: 2
  }
]
