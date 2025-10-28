import { CommonNavigationAction } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, VocabularyItem } from '../constants/endpoints'
import { StandardUnit, StandardUnitId, UserVocabularyUnit } from '../models/Unit'

export type VocabularyItemResult = {
  vocabularyItem: VocabularyItem
  result: SimpleResult | null
  numberOfTries: number
}

export type ContentType = 'standard' | 'userVocabulary' | 'repetition'

type StandardExercise = {
  contentType: 'standard'
  unitId: StandardUnitId
}

type SpecialExercise = {
  contentType: 'userVocabulary' | 'repetition'
}

type SharedExerciseParams = {
  unitTitle: string
  vocabularyItems: VocabularyItem[]
  closeExerciseAction: CommonNavigationAction
  labelOverrides?: { closeExerciseButtonLabel: string; closeExerciseHeaderLabel: string; isCloseButton: boolean }
}

type ExerciseParams = (StandardExercise | SpecialExercise) & SharedExerciseParams

type VocabularyDetailExerciseParams = {
  vocabularyItemIndex: number
} & ExerciseParams

export type StandardExercisesParams = {
  unit: StandardUnit
  jobTitle: string
}
export type SpecialExercisesParams = {
  vocabularyItems: VocabularyItem[]
  unit: UserVocabularyUnit
  jobTitle: string
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
  RepetitionTab: undefined
  UserVocabularyTab: undefined
  VocabularyCollection: undefined
  Home: undefined
  UserVocabularyOverview: undefined
  UserVocabularyProcess: {
    itemToEdit?: VocabularyItem
  }
  UserVocabularyList: undefined
  UserVocabularyDetail: { vocabularyItem: VocabularyItem }
  JobSelection: {
    initialSelection: boolean
  }
  AddCustomDiscipline: undefined
  UnitSelection: {
    job: Discipline
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
  RepetitionWordList: undefined
  VocabularyDetail: { vocabularyItem: VocabularyItem }
  UserVocabularyUnitSelection: undefined
  SpecialExercises: SpecialExercisesParams
}

export type Route = keyof RoutesParams
