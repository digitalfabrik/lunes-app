import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { ArrowNext } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import ExerciseHeader from '../../../components/ExerciseHeader'
import ImageCarousel from '../../../components/ImageCarousel'
import ServerResponseHandler from '../../../components/ServerResponseHandler'
import { Answer, BUTTONS_THEME, numberOfMaxRetries, SIMPLE_RESULTS } from '../../../constants/data'
import { AlternativeWord, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { Return } from '../../../hooks/useLoadAsync'
import { DocumentResult, RoutesParams } from '../../../navigation/NavigationTypes'
import { moveToEnd } from '../../../services/helpers'
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

export const LightLabelInput = styled.Text<{ styledInput?: string }>`
  text-align: center;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  color: ${prop =>
    prop.styledInput ? props => props.theme.colors.lunesBlackLight : props => props.theme.colors.lunesWhite};
`

interface SingleChoiceExerciseProps {
  response: Return<Document[]>
  documentToAnswers: (document: Document) => Answer[]
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  exerciseKey: number
}

const ChoiceExerciseScreen = ({
  response,
  documentToAnswers,
  navigation,
  route,
  exerciseKey
}: SingleChoiceExerciseProps): ReactElement => {
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [newDocuments, setNewDocuments] = useState<Document[] | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<DocumentResult[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null)

  const correctAnswerDelay = 700
  const { data, loading, error, refresh } = response
  const documents = newDocuments ?? data
  const currentDocument = documents ? documents[currentWord] : null

  const result = results.find(elem => elem.id === currentDocument?.id)
  const nthRetry = result?.numberOfTries ?? 0
  const needsToBeRepeated = nthRetry < numberOfMaxRetries && (!result || result.result === SIMPLE_RESULTS.incorrect)

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

  const onExerciseFinished = (results: DocumentResult[]): void => {
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

  const isAnswerEqual = (answer1: Answer | AlternativeWord, answer2: Answer): boolean => {
    return answer1.article.id === answer2.article.id && answer1.word === answer2.word
  }

  const onClickAnswer = (clickedAnswer: Answer): void => {
    if (!currentDocument || !documents || !correctAnswer) {
      return
    }
    setSelectedAnswer(clickedAnswer)

    const correctSelected = [correctAnswer, ...currentDocument.alternatives].find(it =>
      isAnswerEqual(it, clickedAnswer)
    )

    if (correctSelected !== undefined) {
      setCorrectAnswer(clickedAnswer)
      updateResult({
        ...currentDocument,
        result: SIMPLE_RESULTS.correct,
        numberOfTries: nthRetry + 1
      })
    } else {
      updateResult({
        ...currentDocument,
        result: SIMPLE_RESULTS.incorrect,
        numberOfTries: nthRetry + 1
      })
    }
    setTimeout(() => {
      setDelayPassed(true)
    }, correctAnswerDelay)
  }

  const updateResult = (result: DocumentResult): void => {
    const indexOfCurrentResult = results.findIndex(elem => elem.id === currentDocument?.id)
    const newResults = results
    indexOfCurrentResult !== -1 ? (newResults[indexOfCurrentResult] = result) : newResults.push(result)
    setResults(newResults)
  }

  const onFinishWord = (): void => {
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
  const buttonLabel = lastWord && !needsToBeRepeated ? labels.exercises.showResults : labels.exercises.next

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
                <Button
                  label={buttonLabel}
                  iconLeft={ArrowNext}
                  onPress={onFinishWord}
                  buttonTheme={BUTTONS_THEME.contained}
                />
              ) : (
                !lastWord && (
                  <Button
                    label={labels.exercises.tryLater}
                    iconRight={ArrowNext}
                    onPress={tryLater}
                    buttonTheme={BUTTONS_THEME.text}
                  />
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
