import { CommonNavigationAction } from '@react-navigation/native'

import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, Document } from '../constants/endpoints'

export interface DocumentResult {
  document: Document
  result: SimpleResult | null
  numberOfTries: number
}

interface ExerciseParams {
  disciplineTitle: string
  documents: Document[]
  closeExerciseAction: CommonNavigationAction
}

export type ExercisesParams =
  | {
      documents: null
      discipline: Discipline
      disciplineTitle: string
    }
  | ExerciseParams

type ResultParams = ExerciseParams & {
  exercise: ExerciseKey
  results: DocumentResult[]
}

// https://github.com/Microsoft/Script/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RoutesParams = {
  Home: undefined
  Intro: {
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
  ExerciseFinished: ResultParams
  Result: ResultParams
  ResultDetail: ResultParams & {
    resultType: Result
  }
  Imprint: undefined
  ManageDisciplines: undefined
}
