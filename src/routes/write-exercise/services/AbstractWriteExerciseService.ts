import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Keyboard } from 'react-native'

import { SimpleResult } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { RoutesParams, VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { moveToEnd, shuffleArray } from '../../../services/helpers'

export default abstract class AbstractWriteExerciseService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    public route: RouteProp<RoutesParams, 'WriteExercise'>,
    public navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>,
    public setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    public setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    public setVocabularyItemWithResults: React.Dispatch<React.SetStateAction<VocabularyItemResult[]>>, // eslint-disable-next-line no-empty-function
  ) {}

  initializeExercise = (
    vocabularyItems: VocabularyItem[],
    vocabularyItemWithResults: VocabularyItemResult[],
    force = false,
  ): void => {
    if (vocabularyItems.length !== vocabularyItemWithResults.length || force) {
      this.setCurrentIndex(0)
      this.setIsAnswerSubmitted(false)
      this.setVocabularyItemWithResults(
        shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 }))),
      )
    }
  }

  tryLater = (
    currentIndex: number,
    isKeyboardVisible: boolean,
    vocabularyItemWithResults: VocabularyItemResult[],
  ): void => {
    // ImageViewer is not resized correctly if keyboard is not dismissed before going to next vocabularyItem
    if (isKeyboardVisible) {
      const onKeyboardHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        this.setVocabularyItemWithResults(moveToEnd(vocabularyItemWithResults, currentIndex))
        onKeyboardHideSubscription.remove()
      })
      Keyboard.dismiss()
    } else {
      this.setVocabularyItemWithResults(moveToEnd(vocabularyItemWithResults, currentIndex))
    }
  }

  giveUp = async (
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number,
  ): Promise<void> => {
    this.setIsAnswerSubmitted(true)
    await this.storeResult(
      {
        ...current,
        result: 'incorrect',
        numberOfTries: current.numberOfTries + 1,
      },
      vocabularyItemWithResults,
      current,
      currentIndex,
    )
  }

  continueExercise = async (
    currentIndex: number,
    needsToBeRepeated: boolean,
    vocabularyItemWithResults: VocabularyItemResult[],
    vocabularyItems: VocabularyItem[],
    isKeyboardVisible: boolean,
  ): Promise<void> => {
    this.setIsAnswerSubmitted(false)
    if (currentIndex === vocabularyItemWithResults.length - 1 && !needsToBeRepeated) {
      await this.finishExercise(vocabularyItemWithResults, vocabularyItems)
    } else if (needsToBeRepeated) {
      this.tryLater(currentIndex, isKeyboardVisible, vocabularyItemWithResults)
    } else {
      this.setCurrentIndex(oldValue => oldValue + 1)
    }
  }

  abstract storeResult: (
    result: VocabularyItemResult,
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number,
  ) => Promise<void> | void
  abstract cheatExercise: (
    result: SimpleResult,
    vocabularyItems: VocabularyItem[],
    vocabularyItemWithResults: VocabularyItemResult[],
  ) => void
  abstract finishExercise: (results: VocabularyItemResult[], vocabularyItems: VocabularyItem[]) => Promise<void>
}
