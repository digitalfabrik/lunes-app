import { ExerciseKeyType, ResultType, SimpleResultType } from '../constants/data'
import { DocumentsType, DocumentType } from '../constants/endpoints'

export interface DocumentResultType extends DocumentType {
  result: SimpleResultType
}

export type CountsType = {
  [key in SimpleResultType]: number
} & {
  total: number
}

export interface Discipline {
  id: number
  title: string
  numberOfChildren: number
  isLeaf: boolean
  apiKey?: string
}

interface ResultScreenData {
  discipline: Discipline
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
    extraParams: {
      discipline: Discipline
      parentTitle?: string
    }
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
