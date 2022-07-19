import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import { Keyboard } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../assets/images'
import Button from '../../components/Button'
import ExerciseHeader from '../../components/ExerciseHeader'
import { BUTTONS_THEME, ExerciseKeys, numberOfMaxRetries, SIMPLE_RESULTS, SimpleResult } from '../../constants/data'
import labels from '../../constants/labels.json'
import { useIsKeyboardVisible } from '../../hooks/useIsKeyboardVisible'
import { DocumentResult, RoutesParams } from '../../navigation/NavigationTypes'
import { saveExerciseProgress, getDevMode } from '../../services/AsyncStorage'
import { moveToEnd, shuffleArray } from '../../services/helpers'
import InteractionSection from './components/InteractionSection'

const ButtonContainer = styled.View`
  align-items: center;
`

const CheatContainer = styled.View`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  transform: scale(0.6);
  margin-top: -30px;
  width: 100%;
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
  const [cheatsEnabled, setCheatsEnabled] = useState(false)

  const isKeyboardShown = useIsKeyboardVisible()
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
    if (isKeyboardShown) {
      const onKeyboardHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setDocumentsWithResults(moveToEnd(documentsWithResults, currentIndex))
        onKeyboardHideSubscription.remove()
      })
      Keyboard.dismiss()
    } else {
      setDocumentsWithResults(moveToEnd(documentsWithResults, currentIndex))
    }
  }, [isKeyboardShown, documentsWithResults, currentIndex])

  const finishExercise = async (): Promise<void> => {
    if (disciplineId) {
      await saveExerciseProgress(disciplineId, ExerciseKeys.writeExercise, documentsWithResults)
    }
    navigation.navigate('ExerciseFinished', {
      documents,
      disciplineTitle,
      disciplineId,
      results: documentsWithResults,
      exercise: ExerciseKeys.writeExercise,
      closeExerciseAction,
      unlockedNextExercise: false
    })
    initializeExercise(true)
  }

  const continueExercise = async (): Promise<void> => {
    setIsAnswerSubmitted(false)

    if (currentIndex === documentsWithResults.length - 1 && !needsToBeRepeated) {
      await finishExercise()
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

  getDevMode().then(setCheatsEnabled)
  const cheatExercise = async (result: SimpleResult): Promise<void> => {
    const cheatedDocuments = documentsWithResults.map(it => ({ ...it, numberOfTries: 1, result }))
    setDocumentsWithResults(cheatedDocuments)
    setCurrentIndex(documentsWithResults.length - 1)
    setIsAnswerSubmitted(true)
  }

  const giveUp = async (): Promise<void> => {
    setIsAnswerSubmitted(true)
    storeResult({ ...current, result: 'incorrect', numberOfTries: numberOfMaxRetries })
  }

  const buttonLabel =
    currentIndex === documentsWithResults.length - 1 && !needsToBeRepeated
      ? labels.exercises.showResults
      : labels.exercises.next

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
      <ExerciseHeader
        navigation={navigation}
        currentWord={currentIndex}
        numberOfWords={documents.length}
        closeExerciseAction={closeExerciseAction}
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
            <Button label={labels.exercises.write.showSolution} onPress={giveUp} buttonTheme={BUTTONS_THEME.outlined} />

            {currentIndex < documents.length - 1 && (
              <Button
                label={labels.exercises.tryLater}
                iconRight={ArrowRightIcon}
                onPress={tryLater}
                buttonTheme={BUTTONS_THEME.text}
              />
            )}
          </>
        )}
        {cheatsEnabled && (
          <CheatContainer>
            <Button
              label={labels.exercises.cheat.succeed}
              onPress={() => cheatExercise(SIMPLE_RESULTS.correct)}
              buttonTheme={BUTTONS_THEME.outlined}
            />
            <Button
              label={labels.exercises.cheat.fail}
              onPress={() => cheatExercise(SIMPLE_RESULTS.incorrect)}
              buttonTheme={BUTTONS_THEME.outlined}
            />
          </CheatContainer>
        )}
      </ButtonContainer>
    </KeyboardAwareScrollView>
  )
}

export default WriteExerciseScreen
