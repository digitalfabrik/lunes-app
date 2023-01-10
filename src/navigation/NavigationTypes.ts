import { CommonNavigationAction } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, VocabularyItem } from '../constants/endpoints'

export type VocabularyItemResult = {
  vocabularyItem: VocabularyItem
  result: SimpleResult | null
  numberOfTries: number
}

type ExerciseParams = {
  disciplineId: number
  disciplineTitle: string
  vocabularyItems: VocabularyItem[]
  closeExerciseAction: CommonNavigationAction
  labelOverrides?: { closeExerciseButtonLabel: string; closeExerciseHeaderLabel: string; isCloseButton: boolean }
}

type VocabularyDetailExerciseParams = {
  vocabularyItemIndex: number
  disciplineId: number | null
} & Omit<ExerciseParams, 'disciplineId'>

export type ExercisesParams = {
  discipline: Discipline
  vocabularyItems: VocabularyItem[] | null
  closeExerciseAction?: CommonNavigationAction
} & Omit<ExerciseParams, 'vocabularyItems' | 'closeExerciseAction'>

type ResultParams = ExerciseParams & {
  exercise: ExerciseKey
  results: VocabularyItemResult[]
}

// https://github.com/Microsoft/Script/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RoutesParams = {
  BottomTabNavigator: undefined
  HomeTab: undefined
  FavoritesTab: undefined
  DictionaryTab: undefined
  UserVocabularyTab: undefined
  Home: undefined
  UserVocabularyOverview: undefined
  UserVocabularyProcess: {
    headerBackLabel: string
  }
  UserVocabularyList: {
    headerBackLabel: string
  }
  UserVocabularyDetail: { vocabularyItem: VocabularyItem }
  ScopeSelection: {
    initialSelection: boolean
  }
  AddCustomDiscipline: undefined
  DisciplineSelection: {
    discipline: Discipline
  }
  ProfessionSelection: {
    discipline: Discipline
    initialSelection: boolean
  }
  VocabularyDetailExercise: VocabularyDetailExerciseParams
  Exercises: ExercisesParams
  VocabularyList: ExerciseParams
  WordChoiceExercise: ExerciseParams
  ArticleChoiceExercise: ExerciseParams
  WriteExercise: ExerciseParams
  ExerciseFinished: ResultParams & {
    unlockedNextExercise: boolean
  }
  labelOverrides?: ExerciseParams
  Result: ResultParams
  ResultDetail: ResultParams & {
    resultType: Result
  }
  Imprint: undefined
  ManageSelection: undefined
  Settings: undefined
  Favorites: undefined
  Dictionary: undefined
  VocabularyDetail: { vocabularyItem: VocabularyItem }
  UserVocabularyDisciplineSelection: undefined
  UserVocabularyExercises: ExercisesParams
}

export type Route = keyof RoutesParams
