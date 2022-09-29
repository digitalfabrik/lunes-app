import { CommonNavigationAction } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, VocabularyItem } from '../constants/endpoints'

export interface VocabularyItemResult {
  vocabularyItem: VocabularyItem
  result: SimpleResult | null
  numberOfTries: number
}

interface ExerciseParams {
  disciplineId: number
  disciplineTitle: string
  vocabularyItems: VocabularyItem[]
  closeExerciseAction: CommonNavigationAction
  labelOverrides?: { closeExerciseButtonLabel: string; closeExerciseHeaderLabel: string; isCloseButton: boolean }
}

interface VocabularyDetailExerciseParams extends Omit<ExerciseParams, 'disciplineId'> {
  documentIndex: number
  disciplineId: number | null
}

export interface ExercisesParams extends Omit<ExerciseParams, 'vocabularyItems' | 'closeExerciseAction'> {
  discipline: Discipline
  vocabularyItems: VocabularyItem[] | null
  closeExerciseAction?: CommonNavigationAction
}

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
  VocabularyDetail: VocabularyDetailExerciseParams
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
  DictionaryDetail: { vocabularyItem: VocabularyItem }
}

export type Route = keyof RoutesParams
