import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { NextArrow } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import ExerciseHeader from '../../../components/ExerciseHeader'
import ImageCarousel from '../../../components/ImageCarousel'
import ServerResponseHandler from '../../../components/ServerResponseHandler'
import { Answer, BUTTONS_THEME, numberOfMaxRetries, SIMPLE_RESULTS } from '../../../constants/data'
import { AlternativeWordType, DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { ReturnType } from '../../../hooks/useLoadAsync'
import { DocumentResultType, RoutesParamsType } from '../../../navigation/NavigationTypes'
import { moveToEnd } from '../../../services/helpers'
import { LightLabelInput } from '../../write-exercise/components/Actions'
import { SingleChoice } from './SingleChoice'

const ExerciseContainer = styled.View`
  background-color: ${props => props.theme.colors.lunesWhite};
  height: 100%;
  width: 100%;
`

const ButtonContainer = styled.View`
  align-items: center;
  margin: 7% 0;
`

const DarkLabel = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`
const StyledArrow = styled(NextArrow)`
  margin-left: 5px;
`

interface SingleChoiceExercisePropsType {
  response: ReturnType<DocumentType[]>
  documentToAnswers: (document: DocumentType) => Answer[]
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  exerciseKey: number
}

const ChoiceExerciseScreen = ({
  response,
  documentToAnswers,
  navigation,
  route,
  exerciseKey
}: SingleChoiceExercisePropsType): ReactElement => {
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [newDocuments, setNewDocuments] = useState<DocumentType[] | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<DocumentResultType[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null)

  const correctAnswerDelay = 700
  const { data, loading, error, refresh } = response
  const documents = newDocuments ?? data
  const currentDocument = documents ? documents[currentWord] : null

  // Prevent regenerating false answers on every render
  useEffect(() => {
    if (currentDocument) {
      setAnswers(documentToAnswers(currentDocument))
      setCorrectAnswer({ word: currentDocument.word, article: currentDocument.article })
    }
  }, [currentDocument, documentToAnswers])

  const tryLater = useCallback(() => {
    if (documents !== null) {
      setNewDocuments(moveToEnd(documents, currentWord))
    }
  }, [documents, currentWord])

  const onExerciseFinished = (results: DocumentResultType[]): void => {
    navigation.navigate('InitialSummary', {
      result: {
        discipline: { ...route.params.discipline },
        exercise: exerciseKey,
        results: results
      }
    })
    setCurrentWord(0)
    setNewDocuments(null)
  }

  const count = documents?.length ?? 0

  const isAnswerEqual = (answer1: Answer | AlternativeWordType, answer2: Answer): boolean => {
    return answer1.article.id === answer2.article.id && answer1.word === answer2.word
  }

  const onClickAnswer = (clickedAnswer: Answer): void => {
    if (!currentDocument || !documents || !correctAnswer) {
      return
    }
    setSelectedAnswer(clickedAnswer)

    const { nthRetry } = getRetryInfoOfCurrent()

    const correctSelected = [correctAnswer, ...currentDocument.alternatives].find(it =>
      isAnswerEqual(it, clickedAnswer)
    )

    if (correctSelected !== undefined) {
      setCorrectAnswer(clickedAnswer)
      const result: DocumentResultType = {
        ...currentDocument,
        result: SIMPLE_RESULTS.correct,
        numberOfTries: nthRetry + 1
      }
      updateResult(result)
    } else {
      const result: DocumentResultType = {
        ...currentDocument,
        result: SIMPLE_RESULTS.incorrect,
        numberOfTries: nthRetry + 1
      }
      updateResult(result)
    }
    setTimeout(() => {
      setDelayPassed(true)
    }, correctAnswerDelay)
  }

  const updateResult = (result: DocumentResultType): void => {
    const indexOfCurrentResult = results.findIndex(result => result.id === currentDocument?.id)
    const newResults = results
    indexOfCurrentResult !== -1 ? (newResults[indexOfCurrentResult] = result) : newResults.push(result)
    setResults(newResults)
  }

  const getRetryInfoOfCurrent = (): { nthRetry: number; needsToBeRepeated: boolean } => {
    const indexOfCurrent = results.findIndex(result => result.id === currentDocument?.id)
    const nthRetry = indexOfCurrent === -1 ? 0 : results[indexOfCurrent].numberOfTries
    const needsToBeRepeated =
      nthRetry < numberOfMaxRetries &&
      (indexOfCurrent === -1 || results[indexOfCurrent].result === SIMPLE_RESULTS.incorrect)
    return { nthRetry, needsToBeRepeated }
  }

  const onFinishWord = (): void => {
    const { needsToBeRepeated } = getRetryInfoOfCurrent()
    const exerciseFinished = currentWord + 1 >= count && !needsToBeRepeated

    if (exerciseFinished) {
      setCurrentWord(0)
      setSelectedAnswer(null)
      onExerciseFinished(results)
      setResults([])
    } else {
      needsToBeRepeated ? tryLater() : setCurrentWord(prevState => prevState + 1)
    }
    setSelectedAnswer(null)
    setDelayPassed(false)
  }

  const lastWord = currentWord + 1 >= count

  return (
    <ExerciseContainer>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentWord}
        numberOfWords={documents?.length ?? 0}
      />

      <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
        {documents && correctAnswer && currentDocument && (
          <>
            {currentDocument.document_image.length > 0 && <ImageCarousel images={currentDocument.document_image} />}
            <AudioPlayer document={currentDocument} disabled={selectedAnswer === null} />
            <SingleChoice
              answers={answers}
              onClick={onClickAnswer}
              correctAnswer={correctAnswer}
              selectedAnswer={selectedAnswer}
              delayPassed={delayPassed}
            />
            <ButtonContainer>
              {selectedAnswer !== null ? (
                <Button onPress={onFinishWord} buttonTheme={BUTTONS_THEME.dark}>
                  <LightLabelInput>
                    {lastWord && !getRetryInfoOfCurrent().needsToBeRepeated
                      ? labels.exercises.showResults
                      : labels.exercises.next}
                  </LightLabelInput>
                </Button>
              ) : (
                !lastWord && (
                  <Button onPress={tryLater} testID='try-later'>
                    <DarkLabel>{labels.exercises.tryLater}</DarkLabel>
                    <StyledArrow />
                  </Button>
                )
              )}
            </ButtonContainer>
          </>
        )}
      </ServerResponseHandler>
    </ExerciseContainer>
  )
}

export default ChoiceExerciseScreen
