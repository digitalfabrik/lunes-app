import { SimpleResult } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../services/RepetitionService'
import AbstractWriteExerciseService from './AbstractWriteExerciseService'

class RepetitionWriteExerciseService extends AbstractWriteExerciseService {
  finishExercise = async (): Promise<void> => {
    this.navigation.navigate('Repetition')
  }

  storeResult = async (
    result: VocabularyItemResult,
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number
  ): Promise<void> => {
    const updatedVocabularyItemsWithResults = Array.from(vocabularyItemWithResults)
    if (current.vocabularyItem.id !== result.vocabularyItem.id) {
      return
    }
    await RepetitionService.updateWordNodeCard(result)
    updatedVocabularyItemsWithResults[currentIndex] = result
    this.setVocabularyItemWithResults(updatedVocabularyItemsWithResults)
    this.setIsAnswerSubmitted(true)
  }

  cheatExercise = async (
    result: SimpleResult,
    vocabularyItems: VocabularyItem[],
    vocabularyItemWithResults: VocabularyItemResult[]
  ): Promise<void> => {
    const cheatedVocabularyItems = vocabularyItemWithResults.map(it => ({ ...it, numberOfTries: 1, result }))
    cheatedVocabularyItems.forEach(async vocabularyItem => {
      /* eslint-disable no-await-in-loop */
      await RepetitionService.updateWordNodeCard(vocabularyItem)
    })
    await this.finishExercise()
  }
}

export default RepetitionWriteExerciseService
