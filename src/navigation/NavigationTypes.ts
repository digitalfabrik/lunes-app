import { DocumentsType, DocumentType } from '../constants/endpoints'
import { ExerciseKeyType, ResultType, SimpleResultType } from '../constants/data'

export interface DocumentResultType extends DocumentType {
  result: SimpleResultType
}

export type CountsType = {
  [key in SimpleResultType]: number
} & {
  total: number
}

// https://github.com/Microsoft/TypeScript/issues/15300
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RoutesParamsType = {
  Profession: undefined
  ProfessionSubcategory: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
    }
  }
  Exercises: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
    }
  }
  VocabularyOverview: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: number
    }
  }
  SingleChoice: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: string
      exerciseDescription: string
      level: number
    }
  }
  LearnArticles: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: string
      exerciseDescription: string
      level: number
    }
  }
  VocabularyTrainer: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: number
    }
    retryData?: { data: DocumentsType }
  }
  InitialSummary: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: number
    }
    retryData?: { data: DocumentsType }
  }
  ResultsOverview: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: number
    }
    retryData?: { data: DocumentsType }
    results: DocumentResultType[]
  }

  CorrectResults: undefined
  IncorrectResults: undefined
  AlmostCorrectResults: undefined
  ResultScreen: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: number
    }
    retryData?: { data: DocumentsType }
    results: DocumentResultType[]
    resultType: ResultType
    counts: CountsType
  }
}
