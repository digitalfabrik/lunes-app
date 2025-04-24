import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { SimpleResult } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { RoutesParams, VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../services/RepetitionService'
import { StorageCache } from '../../../services/Storage'
import AbstractWriteExerciseService from './AbstractWriteExerciseService'

class RepetitionWriteExerciseService extends AbstractWriteExerciseService {
  public repetitionService: RepetitionService

  constructor(
    route: RouteProp<RoutesParams, 'WriteExercise'>,
    navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    setVocabularyItemWithResults: React.Dispatch<React.SetStateAction<VocabularyItemResult[]>>,
    storageCache: StorageCache,
  ) {
    super(route, navigation, setCurrentIndex, setIsAnswerSubmitted, setVocabularyItemWithResults, storageCache)

    this.repetitionService = new RepetitionService(
      () => storageCache.getItem('wordNodeCards'),
      value => storageCache.setItem('wordNodeCards', value),
    )
  }

  finishExercise = async (): Promise<void> => {
    this.navigation.navigate('Repetition')
  }

  storeResult = async (
    result: VocabularyItemResult,
    vocabularyItemWithResults: VocabularyItemResult[],
    current: VocabularyItemResult,
    currentIndex: number,
  ): Promise<void> => {
    const updatedVocabularyItemsWithResults = Array.from(vocabularyItemWithResults)
    if (current.vocabularyItem.id !== result.vocabularyItem.id) {
      return
    }
    await this.repetitionService.updateWordNodeCard(result)
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
    /* eslint-disable no-restricted-syntax */
    for (const vocabularyItem of cheatedVocabularyItems) {
      /* eslint-disable no-await-in-loop */
      await this.repetitionService.updateWordNodeCard(vocabularyItem)
    }
    await this.finishExercise()
  }
}

export default RepetitionWriteExerciseService
