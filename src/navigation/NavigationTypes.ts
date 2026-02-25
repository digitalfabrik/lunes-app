import { NavigationAction, NavigatorScreenParams } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import Job, { StandardJob } from '../models/Job'
import { StandardUnit, StandardUnitId, UserVocabularyUnit } from '../models/Unit'
import VocabularyItem, { UserVocabularyItem } from '../models/VocabularyItem'

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
  closeExerciseAction: NavigationAction
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

export type BottomTabParams = {
  HomeTab: NavigatorScreenParams<HomeTabParams> | undefined
  FavoritesTab: undefined
  DictionaryTab: undefined
  RepetitionTab: undefined
  UserVocabularyTab: undefined
}

export type HomeTabParams = {
  Home: undefined
  Sponsors: undefined
  Settings: undefined
  Imprint: undefined
}

// https://github.com/Microsoft/Script/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RoutesParams = {
  BottomTabNavigator: NavigatorScreenParams<BottomTabParams> | undefined
  HomeTab: undefined
  FavoritesTab: undefined
  DictionaryTab: undefined
  RepetitionTab: undefined
  UserVocabularyTab: undefined
  VocabularyCollection: undefined
  Home: undefined
  UserVocabularyOverview: undefined
  UserVocabularyProcess: {
    itemToEdit?: UserVocabularyItem
  }
  UserVocabularyList: undefined
  UserVocabularyDetail: { vocabularyItem: UserVocabularyItem }
  JobSelection: {
    initialSelection: boolean
  }
  AddCustomDiscipline: undefined
  UnitSelection: {
    job: Job
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
  TrainingExerciseSelection: {
    job: StandardJob
  }
  ImageTraining: {
    job: StandardJob
  }
  SentenceTraining: {
    job: StandardJob
  }
  TrainingFinished: {
    results: { correct: number; total: number }
    trainingType: 'image' | 'sentence' | 'speech'
    job: StandardJob
  }
  SpeechTraining: {
    job: StandardJob
  }
}

export type Route = keyof RoutesParams
