import {
  easy,
  hard,
  CorrectIcon,
  IncorrectIcon,
  AlmostCorrectIcon,
  CorrectEntriesIcon,
  IncorrectEntriesIcon,
  AlmostCorrectEntriesIcon
} from '../../assets/images'
import { RoutesParamsType } from '../navigation/NavigationTypes'

export const RESULT_TYPE = ['correct', 'similar', 'incorrect']

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

export interface ResultType {
  id: number
  title: string
  icon: number
}

export const RESULTS: ResultType[] = [
  {
    id: 1,
    title: 'Correct entries',
    icon: CorrectIcon
  },
  {
    id: 2,
    title: 'Almost correct entries',
    icon: AlmostCorrectIcon
  },
  {
    id: 3,
    title: 'Incorrect entries',
    icon: IncorrectIcon
  }
]

export const ARTICLES = {
  die: 'die',
  der: 'der',
  das: 'das',
  diePlural: 'die (plural)'
}

export const RESULT_PRESETS = {
  similar: {
    Icon: AlmostCorrectEntriesIcon,
    title: 'Almost Correct',
    next: { title: 'INCORRECT', type: 'incorrect' }
  },
  correct: {
    Icon: CorrectEntriesIcon,
    title: 'Correct',
    next: { title: 'ALMOST CORRECT', type: 'similar' }
  },
  incorrect: {
    Icon: IncorrectEntriesIcon,
    title: 'Incorrect',
    next: { title: 'CORRECT', type: 'correct' }
  }
}
