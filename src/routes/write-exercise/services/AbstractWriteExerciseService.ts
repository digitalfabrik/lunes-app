import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { SimpleResult } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { RoutesParams, VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { shuffleArray } from '../../../services/helpers'

export default abstract class AbstractWriteExerciseService {

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public route: RouteProp<RoutesParams, 'WriteExercise'>,
    public navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>,
    public contentType: string,
    public setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    public setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    public setVocabularyItemWithResults: React.Dispatch<React.SetStateAction<VocabularyItemResult[]>>
  ) {}

  initializeExercise = (
    vocabularyItems: VocabularyItem[],
    vocabularyItemWithResults: VocabularyItemResult[],
    force = false
  ): void => {
    if (vocabularyItems.length !== vocabularyItemWithResults.length || force) {
      this.setCurrentIndex(0)
      this.setIsAnswerSubmitted(false)
      this.setVocabularyItemWithResults(
        shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 })))
      )
    }
  }

  abstract tryLater: (
    currentIndex: number,
    isKeyboardVisible: boolean,
    vocabularyItemWithResults: VocabularyItemResult[]
  ) => void
  abstract continueExercise: (
    currentIndex: number,
    needsToBeRepeated: boolean,
    vocabularyItemWithResults: VocabularyItemResult[],
    vocabularyItems: VocabularyItem[],
    isKeyboardVisible: boolean
  ) => void
  abstract storeResult: (
    result: VocabularyItemResult,
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number
  ) => void
  abstract cheatExercise: (
    result: SimpleResult,
    vocabularyItems: VocabularyItem[],
    vocabularyItemWithResults: VocabularyItemResult[]
  ) => void
  abstract giveUp: (
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number
  ) => void
}
