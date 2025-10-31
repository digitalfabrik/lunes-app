import { ExerciseKeys, SimpleResult } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { saveExerciseProgress } from '../../../services/storageUtils'
import AbstractWriteExerciseService from './AbstractWriteExerciseService'

class StandardWriteExerciseService extends AbstractWriteExerciseService {
  finishExercise = async (results: VocabularyItemResult[], vocabularyItems: VocabularyItem[]): Promise<void> => {
    if (this.route.params.contentType === 'standard') {
      await saveExerciseProgress(this.storageCache, this.route.params.unitId, ExerciseKeys.writeExercise, results)
    }
    this.navigation.navigate('ExerciseFinished', {
      ...this.route.params,
      vocabularyItems,
      results,
      exercise: ExerciseKeys.writeExercise,
      unlockedNextExercise: false,
    })
    this.initializeExercise(vocabularyItems, results, true)
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

  storeResult = (
    result: VocabularyItemResult,
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number,
  ): void => {
    const updatedVocabularyItemsWithResults = Array.from(vocabularyItemWithResults)
    if (current.vocabularyItem.id !== result.vocabularyItem.id) {
      return
    }
    updatedVocabularyItemsWithResults[currentIndex] = result
    this.setVocabularyItemWithResults(updatedVocabularyItemsWithResults)
    this.setIsAnswerSubmitted(true)
  }

  cheatExercise = async (
    result: SimpleResult,
    vocabularyItems: VocabularyItem[],
    vocabularyItemWithResults: VocabularyItemResult[],
  ): Promise<void> => {
    const cheatedVocabularyItems = vocabularyItemWithResults.map(it => ({ ...it, numberOfTries: 1, result }))
    await this.finishExercise(cheatedVocabularyItems, vocabularyItems)
  }
}

export default StandardWriteExerciseService
