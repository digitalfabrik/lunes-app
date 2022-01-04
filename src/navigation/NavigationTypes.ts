import { ExerciseKeyType, ResultType, SimpleResultType } from '../constants/data'
import { DisciplineType, DocumentsType, DocumentType } from '../constants/endpoints'

export interface DocumentResultType extends DocumentType {
  result: SimpleResultType | null
  numberOfTries: number
}

export type CountsType = {
  [key in SimpleResultType]: number
} & {
  total: number
}

interface ResultScreenData {
  discipline: DisciplineType
  exercise: ExerciseKeyType
  results: DocumentResultType[]
  retryData?: { data: DocumentsType }
}

// https://github.com/Microsoft/TypeScript/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RoutesParamsType = {
  Home: undefined
  AddCustomDiscipline: undefined
  DisciplineSelection: {
    discipline: DisciplineType
    parentTitle?: string
  }
  Exercises: {
    discipline: DisciplineType
  }
  VocabularyList: {
    discipline: DisciplineType
  }
  WordChoiceExercise: {
    discipline: DisciplineType
  }
  ArticleChoiceExercise: {
    discipline: DisciplineType
  }
  WriteExercise: {
    discipline: DisciplineType
    retryData?: { data: DocumentsType }
  }
  InitialSummary: {
    result: ResultScreenData
  }
  ResultsOverview: {
    result: ResultScreenData
  }
  ResultScreen: {
    result: ResultScreenData
    resultType: ResultType
    counts: CountsType
  }
  CorrectResults: undefined
  IncorrectResults: undefined
  AlmostCorrectResults: undefined
}
