import { DocumentsType } from '../constants/endpoints'

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
      exercise: string
      exerciseDescription: string
      level: number
    }
    retryData?: { data: DocumentsType }
  }
  InitialSummary: undefined
  ResultsOverview: undefined
  CorrectResults: undefined
  IncorrectResults: undefined
  AlmostCorrectResults: undefined
  ResultScreen: undefined
}
