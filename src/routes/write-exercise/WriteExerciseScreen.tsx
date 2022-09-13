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
import { DocumentResult, RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import { getLabels, moveToEnd, shuffleArray } from '../../services/helpers'
import InteractionSection from './components/InteractionSection'

const ButtonContainer = styled.View`
  align-items: center;
`

export interface WriteExerciseScreenProps {
  route: RouteProp<RoutesParams, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParams, 'WriteExercise'>
}

const WriteExerciseScreen = ({ route, navigation }: WriteExerciseScreenProps): ReactElement => {
  const { documents, disciplineTitle, closeExerciseAction, disciplineId } = route.params
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [documentsWithResults, setDocumentsWithResults] = useState<DocumentResult[]>(
    shuffleArray(documents.map(document => ({ document, result: null, numberOfTries: 0 })))
  )

  const { isKeyboardVisible } = useKeyboard()
  const current = documentsWithResults[currentIndex]
  const needsToBeRepeated = current.numberOfTries < numberOfMaxRetries && current.result !== SIMPLE_RESULTS.correct

  const initializeExercise = useCallback(
    (force = false) => {
      if (documents.length !== documentsWithResults.length || force) {
        setCurrentIndex(0)
        setIsAnswerSubmitted(false)
        setDocumentsWithResults(shuffleArray(documents.map(document => ({ document, result: null, numberOfTries: 0 }))))
      }
    },
    [documents, documentsWithResults]
  )

  useEffect(initializeExercise, [initializeExercise])

  const tryLater = useCallback(() => {
    // ImageViewer is not resized correctly if keyboard is not dismissed before going to next document
    if (isKeyboardVisible) {
      const onKeyboardHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setDocumentsWithResults(moveToEnd(documentsWithResults, currentIndex))
        onKeyboardHideSubscription.remove()
      })
      Keyboard.dismiss()
    } else {
      setDocumentsWithResults(moveToEnd(documentsWithResults, currentIndex))
    }
  }, [isKeyboardVisible, documentsWithResults, currentIndex])

  const finishExercise = async (results: DocumentResult[]): Promise<void> => {
    if (disciplineId) {
      await AsyncStorage.saveExerciseProgress(disciplineId, ExerciseKeys.writeExercise, results)
    }
    navigation.navigate('ExerciseFinished', {
      documents,
      disciplineTitle,
      disciplineId,
      results,
      exercise: ExerciseKeys.writeExercise,
      closeExerciseAction,
      unlockedNextExercise: false,
    })
    initializeExercise(true)
  }

  const continueExercise = async (): Promise<void> => {
    setIsAnswerSubmitted(false)

    if (currentIndex === documentsWithResults.length - 1 && !needsToBeRepeated) {
      await finishExercise(documentsWithResults)
    } else if (needsToBeRepeated) {
      tryLater()
    } else {
      setCurrentIndex(oldValue => oldValue + 1)
    }
  }

  const storeResult = (result: DocumentResult): void => {
    const updatedDocumentsWithResults = Array.from(documentsWithResults)
    if (current.document.id !== result.document.id) {
      return
    }
    updatedDocumentsWithResults[currentIndex] = result
    setDocumentsWithResults(updatedDocumentsWithResults)
    setIsAnswerSubmitted(true)
  }

  const cheatExercise = async (result: SimpleResult): Promise<void> => {
    const cheatedDocuments = documentsWithResults.map(it => ({ ...it, numberOfTries: 1, result }))
    await finishExercise(cheatedDocuments)
  }

  const giveUp = async (): Promise<void> => {
    setIsAnswerSubmitted(true)
    storeResult({ ...current, result: 'incorrect', numberOfTries: current.numberOfTries + 1 })
  }

  const buttonLabel =
    currentIndex === documentsWithResults.length - 1 && !needsToBeRepeated
      ? getLabels().exercises.showResults
      : getLabels().exercises.next

  return (
    <RouteWrapper>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
        <ExerciseHeader
          navigation={navigation}
          currentWord={currentIndex}
          numberOfWords={documents.length}
          closeExerciseAction={closeExerciseAction}
          feedbackType={FeedbackType.document}
          feedbackForId={documents[currentIndex].id}
        />

        <InteractionSection
          documentWithResult={current}
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
              {currentIndex < documents.length - 1 && (
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
