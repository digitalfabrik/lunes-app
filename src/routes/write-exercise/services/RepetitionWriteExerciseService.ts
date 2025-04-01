import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

import { SimpleResult } from '../../../constants/data'
import { VocabularyItem } from '../../../constants/endpoints'
import { RoutesParams, VocabularyItemResult } from '../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../services/RepetitionService'
import AbstractWriteExerciseService from './AbstractWriteExerciseService'

class RepetitionWriteExerciseService extends AbstractWriteExerciseService {
  constructor(
    route: RouteProp<RoutesParams, 'WriteExercise'>,
    navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>,
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
    setVocabularyItemWithResults: React.Dispatch<React.SetStateAction<VocabularyItemResult[]>>, // eslint-disable-next-line no-empty-function
    public repetitionService: RepetitionService,
  ) {
    super(route, navigation, setCurrentIndex, setIsAnswerSubmitted, setVocabularyItemWithResults)
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
    this.repetitionService.updateWordNodeCard(result)
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
      this.repetitionService.updateWordNodeCard(vocabularyItem)
    }
    await this.finishExercise()
  }
}

export default RepetitionWriteExerciseService
