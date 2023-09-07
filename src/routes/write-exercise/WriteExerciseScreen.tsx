import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import CheatMode from '../../components/CheatMode'
import ExerciseHeader from '../../components/ExerciseHeader'
import RouteWrapper from '../../components/RouteWrapper'
import {
  BUTTONS_THEME,
  ExerciseKeys,
  FeedbackType,
  numberOfMaxRetries,
  SIMPLE_RESULTS,
  SimpleResult,
} from '../../constants/data'
import useKeyboard from '../../hooks/useKeyboard'
import { VocabularyItemResult, RoutesParams } from '../../navigation/NavigationTypes'
import { saveExerciseProgress } from '../../services/AsyncStorage'
import { getLabels, moveToEnd, shuffleArray } from '../../services/helpers'
import InteractionSection from './components/InteractionSection'

const ButtonContainer = styled.View`
  align-items: center;
`

export type WriteExerciseScreenProps = {
  route: RouteProp<RoutesParams, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>
}

const WriteExerciseScreen = ({ route, navigation }: WriteExerciseScreenProps): ReactElement => {
  const { vocabularyItems, closeExerciseAction, contentType } = route.params
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [vocabularyItemWithResults, setVocabularyItemWithResults] = useState<VocabularyItemResult[]>(
    shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 })))
  )

  const { isKeyboardVisible } = useKeyboard()
  const current = vocabularyItemWithResults[currentIndex]
  const needsToBeRepeated = current.numberOfTries < numberOfMaxRetries && current.result !== SIMPLE_RESULTS.correct

  const initializeExercise = useCallback(
    (force = false) => {
      if (vocabularyItems.length !== vocabularyItemWithResults.length || force) {
        setCurrentIndex(0)
        setIsAnswerSubmitted(false)
        setVocabularyItemWithResults(
          shuffleArray(vocabularyItems.map(vocabularyItem => ({ vocabularyItem, result: null, numberOfTries: 0 })))
        )
      }
    },
    [vocabularyItems, vocabularyItemWithResults]
  )

  useEffect(initializeExercise, [initializeExercise])

  const tryLater = useCallback(() => {
    // ImageViewer is not resized correctly if keyboard is not dismissed before going to next vocabularyItem
    if (isKeyboardVisible) {
      const onKeyboardHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setVocabularyItemWithResults(moveToEnd(vocabularyItemWithResults, currentIndex))
        onKeyboardHideSubscription.remove()
      })
      Keyboard.dismiss()
    } else {
      setVocabularyItemWithResults(moveToEnd(vocabularyItemWithResults, currentIndex))
    }
  }, [isKeyboardVisible, vocabularyItemWithResults, currentIndex])

  const finishExercise = async (results: VocabularyItemResult[]): Promise<void> => {
    if (contentType === 'standard') {
      await saveExerciseProgress(route.params.disciplineId, ExerciseKeys.writeExercise, results)
    }
    navigation.navigate('ExerciseFinished', {
      ...route.params,
      vocabularyItems,
      results,
      exercise: ExerciseKeys.writeExercise,
      unlockedNextExercise: false,
    })
    initializeExercise(true)
  }

  const continueExercise = async (): Promise<void> => {
    setIsAnswerSubmitted(false)

    if (currentIndex === vocabularyItemWithResults.length - 1 && !needsToBeRepeated) {
      await finishExercise(vocabularyItemWithResults)
    } else if (needsToBeRepeated) {
      tryLater()
    } else {
      setCurrentIndex(oldValue => oldValue + 1)
    }
  }

  const storeResult = (result: VocabularyItemResult): void => {
    const updatedVocabularyItemsWithResults = Array.from(vocabularyItemWithResults)
    if (current.vocabularyItem.id !== result.vocabularyItem.id) {
      return
    }
    updatedVocabularyItemsWithResults[currentIndex] = result
    setVocabularyItemWithResults(updatedVocabularyItemsWithResults)
    setIsAnswerSubmitted(true)
  }

  const cheatExercise = async (result: SimpleResult): Promise<void> => {
    const cheatedVocabularyItems = vocabularyItemWithResults.map(it => ({ ...it, numberOfTries: 1, result }))
    await finishExercise(cheatedVocabularyItems)
  }

  const giveUp = async (): Promise<void> => {
    setIsAnswerSubmitted(true)
    storeResult({ ...current, result: 'incorrect', numberOfTries: current.numberOfTries + 1 })
  }

  const buttonLabel =
    currentIndex === vocabularyItemWithResults.length - 1 && !needsToBeRepeated
      ? getLabels().exercises.showResults
      : getLabels().exercises.next

  return (
    <RouteWrapper>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
        <ExerciseHeader
          navigation={navigation}
          currentWord={currentIndex}
          numberOfWords={vocabularyItems.length}
          closeExerciseAction={closeExerciseAction}
          feedbackType={FeedbackType.vocabularyItem}
          feedbackForId={vocabularyItems[currentIndex].id}
          exerciseKey={ExerciseKeys.writeExercise}
        />

        <InteractionSection
          vocabularyItemWithResult={current}
          storeResult={storeResult}
          isAnswerSubmitted={isAnswerSubmitted}
        />
        <ButtonContainer>
          {isAnswerSubmitted && current.result !== 'similar' ? (
            <Button
              label={buttonLabel}
              iconRight={ArrowRightIcon}
              onPress={continueExercise}
              buttonTheme={BUTTONS_THEME.contained}
            />
          ) : (
            <>
              <Button
                label={getLabels().exercises.write.showSolution}
                onPress={giveUp}
                buttonTheme={BUTTONS_THEME.outlined}
              />
              {currentIndex < vocabularyItems.length - 1 && (
                <Button
                  label={getLabels().exercises.tryLater}
                  iconRight={ArrowRightIcon}
                  onPress={tryLater}
                  buttonTheme={BUTTONS_THEME.text}
                />
              )}
            </>
          )}
          <CheatMode cheat={cheatExercise} />
        </ButtonContainer>
      </KeyboardAwareScrollView>
    </RouteWrapper>
  )
}

export default WriteExerciseScreen
