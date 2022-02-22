import { ExerciseKey, Result, SimpleResult } from '../constants/data'
import { Discipline, Documents, Document } from '../constants/endpoints'

export interface DocumentResult extends Document {
  result: SimpleResult | null
  numberOfTries: number
}

export type Counts = {
  [key in SimpleResult]: number
} & {
  total: number
}

interface ResultScreenData {
  discipline: Discipline
  exercise: ExerciseKey
  results: DocumentResult[]
  retryData?: { data: Documents }
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
  VocabularyList: {
    discipline: Discipline
  }
  WordChoiceExercise: {
    discipline: Discipline
  }
  ArticleChoiceExercise: {
    discipline: Discipline
  }
  WriteExercise: {
    discipline: Discipline
    retryData?: { data: Documents }
  }
  ExerciseFinished: {
    result: ResultScreenData
  }
  Result: {
    result: ResultScreenData
  }
  ResultDetail: {
    result: ResultScreenData
    resultType: Result
    counts: Counts
  }
  CorrectResults: undefined
  IncorrectResults: undefined
  AlmostCorrectResults: undefined
}
