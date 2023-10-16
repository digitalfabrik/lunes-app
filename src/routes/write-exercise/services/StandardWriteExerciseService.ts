import {Keyboard} from 'react-native'

import {ExerciseKeys, SimpleResult} from '../../../constants/data'
import {VocabularyItem} from '../../../constants/endpoints'
import {VocabularyItemResult} from '../../../navigation/NavigationTypes'
import {saveExerciseProgress} from '../../../services/AsyncStorage'
import {moveToEnd} from '../../../services/helpers'
import AbstractWriteExerciseService from './AbstractWriteExerciseService'

class StandardWriteExerciseService extends AbstractWriteExerciseService {
    tryLater = (
        currentIndex: number,
        isKeyboardVisible: boolean,
        vocabularyItemWithResults: VocabularyItemResult[]
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

    private finishExercise = async (
        results: VocabularyItemResult[],
        vocabularyItems: VocabularyItem[]
    ): Promise<void> => {
        if (this.route.params.contentType === 'standard') {
            await saveExerciseProgress(this.route.params.disciplineId, ExerciseKeys.writeExercise, results)
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
        isKeyboardVisible: boolean
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
        currentIndex: number
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
        vocabularyItemWithResults: VocabularyItemResult[]
    ): Promise<void> => {
        const cheatedVocabularyItems = vocabularyItemWithResults.map(it => ({...it, numberOfTries: 1, result}))
        await this.finishExercise(cheatedVocabularyItems, vocabularyItems)
    }

    giveUp = async (
        vocabularyItemWithResults: VocabularyItemResult[],
        current: VocabularyItemResult,
        currentIndex: number
    ): Promise<void> => {
        this.setIsAnswerSubmitted(true)
        this.storeResult(
            {
                ...current,
                result: 'incorrect',
                numberOfTries: current.numberOfTries + 1,
            },
            vocabularyItemWithResults,
            current,
            currentIndex
        )
    }
}

export default StandardWriteExerciseService
