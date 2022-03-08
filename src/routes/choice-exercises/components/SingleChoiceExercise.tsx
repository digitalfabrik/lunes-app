import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import ExerciseHeader from '../../../components/ExerciseHeader'
import ImageCarousel from '../../../components/ImageCarousel'
import { Answer, BUTTONS_THEME, numberOfMaxRetries, SIMPLE_RESULTS } from '../../../constants/data'
import { AlternativeWord, Discipline, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { DocumentResult, RoutesParams } from '../../../navigation/NavigationTypes'
import { moveToEnd } from '../../../services/helpers'
import { SingleChoice } from './SingleChoice'

const ExerciseContainer = styled.View`
  background-color: ${props => props.theme.colors.background};
  height: 100%;
  width: 100%;
`

const ButtonContainer = styled.View`
  align-items: center;
  margin: ${props => `${props.theme.spacings.sm} 0`};
`

interface SingleChoiceExerciseProps {
  documents: Document[]
  discipline: Discipline
  documentToAnswers: (document: Document) => Answer[]
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  exerciseKey: number
}

const ChoiceExerciseScreen = ({
  documents: documentsProp,
  discipline,
  documentToAnswers,
  navigation,
  route,
  exerciseKey
}: SingleChoiceExerciseProps): ReactElement => {
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [documents, setDocuments] = useState<Document[]>(documentsProp)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<DocumentResult[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null)

  const correctAnswerDelay = 700
  const currentDocument = documents[currentWord]

  const result = results.find(elem => elem.document.id === currentDocument.id)
  const nthRetry = result?.numberOfTries ?? 0
  const needsToBeRepeated = nthRetry < numberOfMaxRetries && (!result || result.result === SIMPLE_RESULTS.incorrect)

  // Prevent regenerating false answers on every render
  useEffect(() => {
    setAnswers(documentToAnswers(currentDocument))
    setCorrectAnswer({ word: currentDocument.word, article: currentDocument.article })
  }, [currentDocument, documentToAnswers])

  const tryLater = useCallback(() => {
    setDocuments(moveToEnd(documents, currentWord))
  }, [documents, currentWord])

  const onExerciseFinished = (results: DocumentResult[]): void => {
    navigation.navigate('ExerciseFinished', {
      documents,
      discipline,
      exercise: exerciseKey,
      results
    })
    setCurrentWord(0)
  }
  const count = documents.length

  const isAnswerEqual = (answer1: Answer | AlternativeWord, answer2: Answer): boolean =>
    answer1.article.id === answer2.article.id && answer1.word === answer2.word

  const updateResult = (result: DocumentResult): void => {
    const indexOfCurrentResult = results.findIndex(elem => elem.document.id === currentDocument.id)
    const newResults = results
    if (indexOfCurrentResult !== -1) {
      newResults[indexOfCurrentResult] = result
    } else {
      newResults.push(result)
    }
    setResults(newResults)
  }

  const onClickAnswer = (clickedAnswer: Answer): void => {
    if (!correctAnswer) {
      return
    }
    setSelectedAnswer(clickedAnswer)

    const correctSelected = [correctAnswer, ...currentDocument.alternatives].find(it =>
      isAnswerEqual(it, clickedAnswer)
    )

    if (correctSelected !== undefined) {
      setCorrectAnswer(clickedAnswer)
      updateResult({
        document: currentDocument,
        result: SIMPLE_RESULTS.correct,
        numberOfTries: nthRetry + 1
      })
    } else {
      updateResult({
        document: currentDocument,
        result: SIMPLE_RESULTS.incorrect,
        numberOfTries: nthRetry + 1
      })
    }
    setTimeout(() => {
      setDelayPassed(true)
    }, correctAnswerDelay)
  }

  const onFinishWord = (): void => {
    const exerciseFinished = currentWord + 1 >= count && !needsToBeRepeated

    if (exerciseFinished) {
      setCurrentWord(0)
      setSelectedAnswer(null)
      onExerciseFinished(results)
      setResults([])
    } else if (needsToBeRepeated) {
      tryLater()
    } else {
      setCurrentWord(prevState => prevState + 1)
    }
    setSelectedAnswer(null)
    setDelayPassed(false)
  }

  const lastWord = currentWord + 1 >= count
  const buttonLabel = lastWord && !needsToBeRepeated ? labels.exercises.showResults : labels.exercises.next

  return (
    <ExerciseContainer>
      <ExerciseHeader navigation={navigation} route={route} currentWord={currentWord} numberOfWords={count} />

      {correctAnswer && (
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
                iconRight={ArrowRightIcon}
                onPress={onFinishWord}
                buttonTheme={BUTTONS_THEME.contained}
              />
            ) : (
              !lastWord && (
                <Button
                  label={labels.exercises.tryLater}
                  iconRight={ArrowRightIcon}
                  onPress={tryLater}
                  buttonTheme={BUTTONS_THEME.text}
                />
              )
            )}
          </ButtonContainer>
        </>
      )}
    </ExerciseContainer>
  )
}

export default ChoiceExerciseScreen
