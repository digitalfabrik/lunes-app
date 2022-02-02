import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useCallback, useState } from 'react'
import { Keyboard } from 'react-native'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import ExerciseHeader from '../../../components/ExerciseHeader'
import ImageCarousel from '../../../components/ImageCarousel'
import { BUTTONS_THEME, ExerciseKeys, numberOfMaxRetries, SIMPLE_RESULTS } from '../../../constants/data'
import { DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { DocumentResultType, RoutesParamsType } from '../../../navigation/NavigationTypes'
import { moveToEnd } from '../../../services/helpers'
import InteractionSection from './InteractionSection'

const StyledContainer = styled.View`
  padding-top: 20px;
  padding-bottom: 30px;
  align-items: center;
  position: relative;
  width: 100%;
  height: 85%;
`

export interface WriteExercisePropType {
  documents: DocumentType[]
  route: RouteProp<RoutesParamsType, 'WriteExercise'>
  navigation: StackNavigationProp<RoutesParamsType, 'WriteExercise'>
}

const WriteExercise = ({ documents, route, navigation }: WriteExercisePropType): ReactElement => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false)
  const [documentsWithResults, setDocumentsWithResults] = useState<DocumentResultType[]>(
    documents.map(document => ({
      ...document,
      result: null,
      numberOfTries: 0
    }))
  )

  const current = documentsWithResults[currentIndex]
  const needsToBeRepeated = current.numberOfTries < numberOfMaxRetries && current.result !== SIMPLE_RESULTS.correct

  const tryLater = useCallback(() => {
    setDocumentsWithResults(moveToEnd(documentsWithResults, currentIndex))
    Keyboard.dismiss()
  }, [documentsWithResults, currentIndex])

  const finishExercise = (): void => {
    navigation.navigate('InitialSummary', {
      result: {
        discipline: { ...route.params.discipline },
        results: documentsWithResults,
        exercise: ExerciseKeys.writeExercise
      }
    })
  }

  const continueExercise = (): void => {
    setIsAnswerSubmitted(false)

    if (currentIndex === documentsWithResults.length - 1 && !needsToBeRepeated) {
      finishExercise()
    } else if (needsToBeRepeated) {
      tryLater()
    } else {
      setCurrentIndex(oldValue => oldValue + 1)
    }
  }

  const storeResult = (result: DocumentResultType): void => {
    const updatedDocumentsWithResults = Array.from(documentsWithResults)
    if (current.id !== result.id) {
      return
    }
    updatedDocumentsWithResults[currentIndex] = result
    setDocumentsWithResults(updatedDocumentsWithResults)
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
    <>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentIndex}
        numberOfWords={documents.length}
      />

      <ImageCarousel images={current.document_image} />

      <StyledContainer>
        <InteractionSection
          documentWithResult={current}
          storeResult={storeResult}
          isAnswerSubmitted={isAnswerSubmitted}
        />

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
      </StyledContainer>
    </>
  )
}

export default WriteExercise
