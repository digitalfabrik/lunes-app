import { CommonNavigationAction } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, VocabularyItem } from '../constants/endpoints'

export type VocabularyItemResult = {
  vocabularyItem: VocabularyItem
  result: SimpleResult | null
  numberOfTries: number
}

export type ContentType = 'standard' | 'userVocabulary' | 'repetition'

type StandardExercise = {
  contentType: 'standard'
  disciplineId: number
}

type SpecialExercise = {
  contentType: 'userVocabulary' | 'repetition'
}

type SharedExerciseParams = {
  disciplineTitle: string
  vocabularyItems: VocabularyItem[]
  closeExerciseAction: CommonNavigationAction
  labelOverrides?: { closeExerciseButtonLabel: string; closeExerciseHeaderLabel: string; isCloseButton: boolean }
}

type ExerciseParams = (StandardExercise | SpecialExercise) & SharedExerciseParams

type VocabularyDetailExerciseParams = {
  vocabularyItemIndex: number
} & ExerciseParams

type SharedExercisesParams = {
  discipline: Discipline
  vocabularyItems: VocabularyItem[] | null
  closeExerciseAction?: CommonNavigationAction
} & Omit<SharedExerciseParams, 'vocabularyItems' | 'closeExerciseAction'>

export type StandardExercisesParams = StandardExercise & SharedExercisesParams
export type SpecialExercisesParams = SpecialExercise & SharedExercisesParams

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
  RepetitionTab: undefined
  UserVocabularyTab: undefined
  VocabularyCollection: undefined
  Home: undefined
  UserVocabularyOverview: undefined
  UserVocabularyProcess: {
    headerBackLabel: string
    itemToEdit?: VocabularyItem
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
  StandardExercises: StandardExercisesParams
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
  OverlayMenu: undefined
  Sponsors: undefined
  Favorites: undefined
  Dictionary: undefined
  Repetition: undefined
  VocabularyDetail: { vocabularyItem: VocabularyItem }
  UserVocabularyDisciplineSelection: undefined
  SpecialExercises: SpecialExercisesParams
}

export type Route = keyof RoutesParams
