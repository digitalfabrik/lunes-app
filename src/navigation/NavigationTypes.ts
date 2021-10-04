import { ComponentType } from 'react'
import { SvgProps } from 'react-native-svg'

import { ExerciseKeyType, ResultType, SimpleResultType } from '../constants/data'
import { DisciplineType, DocumentsType, DocumentType } from '../constants/endpoints'

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
      module: DisciplineType
      parentTitle?: string
    }
  }
  Exercises: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      documentsLength: number
    }
  }
  VocabularyList: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: ComponentType<SvgProps>
    }
  }
  WordChoiceExercise: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      documentsLength: number
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: ComponentType<SvgProps>
    }
  }
  ArticleChoiceExercise: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      documentsLength: number
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: ComponentType<SvgProps>
    }
  }
  WriteExercise: {
    extraParams: {
      disciplineID: number
      disciplineTitle: string
      disciplineIcon: string
      trainingSetId: number
      trainingSet: string
      documentsLength: number
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: ComponentType<SvgProps>
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
      level: ComponentType<SvgProps>
      documentsLength: number
      results: DocumentResultType[]
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
      documentsLength: number
      exercise: ExerciseKeyType
      exerciseDescription: string
      level: ComponentType<SvgProps>
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
      documentsLength: number
      exerciseDescription: string
      level: ComponentType<SvgProps>
    }
    retryData?: { data: DocumentsType }
    results: DocumentResultType[]
    resultType: ResultType
    counts: CountsType
  }
}
