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
  Exercises: undefined
  VocabularyOverview: undefined
  VocabularyTrainer: undefined
  InitialSummary: undefined
  ResultsOverview: undefined
  CorrectResults: undefined
  IncorrectResults: undefined
  AlmostCorrectResults: undefined
  ResultScreen: undefined
}
