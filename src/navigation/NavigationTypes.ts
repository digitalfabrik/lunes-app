import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, Document } from '../constants/endpoints'

export interface DocumentResult {
  document: Document
  result: SimpleResult | null
  numberOfTries: number
}

export type Counts = {
  [key in SimpleResult]: number
} & {
  total: number
}

interface ExerciseParams {
  discipline: Discipline
  documents: Document[]
}

type ResultScreenData = ExerciseParams & {
  exercise: ExerciseKey
  results: DocumentResult[]
  documents: Document[]
}

// https://github.com/Microsoft/Script/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RoutesParams = {
  Home: undefined
  AddCustomDiscipline: undefined
  DisciplineSelection: {
    discipline: Discipline
  }
  Exercises: {
    discipline: Discipline
  }
  VocabularyList: ExerciseParams
  WordChoiceExercise: ExerciseParams
  ArticleChoiceExercise: ExerciseParams
  WriteExercise: ExerciseParams
  ExerciseFinished: ResultScreenData
  Result: ResultScreenData
  ResultDetail: ResultScreenData & {
    resultType: Result
  }
  Imprint: undefined
}
