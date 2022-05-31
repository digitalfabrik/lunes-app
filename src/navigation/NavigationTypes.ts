import { CommonNavigationAction } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, Document } from '../constants/endpoints'

export interface DocumentResult {
  document: Document
  result: SimpleResult | null
  numberOfTries: number
}

interface ExerciseParams {
  disciplineId: number
  disciplineTitle: string
  documents: Document[]
  closeExerciseAction: CommonNavigationAction
}

export interface ExercisesParams extends Omit<ExerciseParams, 'documents' | 'closeExerciseAction'> {
  discipline: Discipline
  documents: Document[] | null
  closeExerciseAction?: CommonNavigationAction
}

type ResultParams = ExerciseParams & {
  exercise: ExerciseKey
  results: DocumentResult[]
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
  Exercises: ExercisesParams
  VocabularyList: ExerciseParams
  WordChoiceExercise: ExerciseParams
  ArticleChoiceExercise: ExerciseParams
  WriteExercise: ExerciseParams
  ExerciseFinished: ResultParams & {
    unlockedNextExercise?: boolean
  }
  Result: ResultParams
  ResultDetail: ResultParams & {
    resultType: Result
  }
  Imprint: undefined
  ManageDisciplines: undefined
}

export type Route = keyof RoutesParams
