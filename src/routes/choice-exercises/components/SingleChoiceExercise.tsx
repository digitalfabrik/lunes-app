import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import DocumentImageSection from '../../../components/DocumentImageSection'
import ExerciseHeader from '../../../components/ExerciseHeader'
import { Answer, BUTTONS_THEME, numberOfMaxRetries, SIMPLE_RESULTS, SimpleResult } from '../../../constants/data'
import { AlternativeWord, Document } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { DocumentResult, RoutesParams } from '../../../navigation/NavigationTypes'
import { moveToEnd, shuffleArray } from '../../../services/helpers'
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
  disciplineTitle: string
  documentToAnswers: (document: Document) => Answer[]
  navigation: StackNavigationProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParams, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  exerciseKey: number
}

const CORRECT_ANSWER_DELAY = 700

const ChoiceExerciseScreen = ({
  documents,
  disciplineTitle,
  documentToAnswers,
  navigation,
  route,
  exerciseKey
}: SingleChoiceExerciseProps): ReactElement => {
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<DocumentResult[]>(
    shuffleArray(documents.map(document => ({ document, result: null, numberOfTries: 0 })))
  )
  const { document, numberOfTries, result } = results[currentWord]
  const [answers, setAnswers] = useState<Answer[]>(documentToAnswers(document))

  const correctAnswers = [{ word: document.word, article: document.article }, ...document.alternatives]
  const needsToBeRepeated = numberOfTries < numberOfMaxRetries && result === SIMPLE_RESULTS.incorrect

  const initializeExercise = useCallback(
    (force = false) => {
      if (documents.length !== results.length || force) {
        setCurrentWord(0)
        setResults(shuffleArray(documents.map(document => ({ document, result: null, numberOfTries: 0 }))))
      }
    },
    [documents, results]
  )

  useEffect(initializeExercise, [initializeExercise])

  useEffect(() => setAnswers(documentToAnswers(document)), [document, documentToAnswers])

  const tryLater = useCallback(() => {
    setResults(moveToEnd(results, currentWord))
  }, [results, currentWord])

  const onExerciseFinished = (results: DocumentResult[]): void => {
    navigation.navigate('ExerciseFinished', {
      documents,
      disciplineTitle,
      exercise: exerciseKey,
      results,
      closeExerciseAction: route.params.closeExerciseAction
    })

    initializeExercise(true)
  }
  const count = documents.length

  const isAnswerEqual = (answer1: Answer | AlternativeWord, answer2: Answer): boolean =>
    answer1.article.id === answer2.article.id && answer1.word === answer2.word

  const updateResult = (numberOfTries: number, result: SimpleResult): void => {
    const newResults = [...results]
    newResults[currentWord] = { ...newResults[currentWord], numberOfTries, result }
    setResults(newResults)
  }

  const onClickAnswer = (clickedAnswer: Answer): void => {
    setSelectedAnswer(clickedAnswer)

    const isCorrect = correctAnswers.some(it => isAnswerEqual(it, clickedAnswer))
    updateResult(numberOfTries + 1, isCorrect ? SIMPLE_RESULTS.correct : SIMPLE_RESULTS.incorrect)

    setTimeout(() => {
      setDelayPassed(true)
    }, CORRECT_ANSWER_DELAY)
  }

  const onFinishWord = (): void => {
    const exerciseFinished = currentWord + 1 >= count && !needsToBeRepeated

    if (exerciseFinished) {
      onExerciseFinished(results)
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
      <ExerciseHeader navigation={navigation} currentWord={currentWord} numberOfWords={count} />

      <>
        <DocumentImageSection document={document} audioDisabled={selectedAnswer === null} />
        <SingleChoice
          answers={answers}
          onClick={onClickAnswer}
          correctAnswers={correctAnswers}
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
    </ExerciseContainer>
  )
}

export default ChoiceExerciseScreen
