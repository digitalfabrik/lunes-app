import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import ErrorMessage from '../../../components/ErrorMessage'
import ExerciseHeader from '../../../components/ExerciseHeader'
import ImageCarousel from '../../../components/ImageCarousel'
import Loading from '../../../components/Loading'
import { Answer, BUTTONS_THEME, SIMPLE_RESULTS } from '../../../constants/data'
import { AlternativeWordType, DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
import { ReturnType } from '../../../hooks/useLoadFromEndpoint'
import { DocumentResultType, RoutesParamsType } from '../../../navigation/NavigationTypes'
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

interface SingleChoiceExercisePropsType {
  response: ReturnType<DocumentType[]>
  documentToAnswers: (document: DocumentType) => Answer[]
  onExerciseFinished: (results: DocumentResultType[]) => void
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
}

const ChoiceExerciseScreen = ({
  response,
  documentToAnswers,
  onExerciseFinished,
  navigation,
  route
}: SingleChoiceExercisePropsType): ReactElement => {
  const [currentWord, setCurrentWord] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<DocumentResultType[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = useState<Answer>()

  const correctAnswerDelay = 700
  const { data: documents, loading, error, refresh } = response
  const currentDocument = documents ? documents[currentWord] : null

  // Prevent regenerating false answers on every render
  useEffect(() => {
    if (currentDocument) {
      setAnswers(documentToAnswers(currentDocument))
      setCorrectAnswer({ word: currentDocument.word, article: currentDocument.article })
    }
  }, [currentDocument, documentToAnswers])

  const count = documents?.length ?? 0

  const isAnswerEqual = (answer1: Answer | AlternativeWordType, answer2: Answer): boolean => {
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
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.correct }
      setResults([...results, result])
    } else {
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.incorrect }
      setResults([...results, result])
    }
    setTimeout(() => {
      setDelayPassed(true)
    }, correctAnswerDelay)
  }

  const onFinishWord = (): void => {
    const exerciseFinished = currentWord + 1 >= count
    if (exerciseFinished) {
      setCurrentWord(0)
      setSelectedAnswer(null)
      onExerciseFinished(results)
      setCurrentWord(0)
      setResults([])
    } else {
      setCurrentWord(prevState => prevState + 1)
    }
    setSelectedAnswer(null)
    setDelayPassed(false)
  }

  return (
    <ExerciseContainer>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentWord}
        numberOfWords={documents?.length ?? 0}
      />
      <Loading isLoading={loading}>
        <>
          <ErrorMessage error={error} refresh={refresh} />
          {documents && correctAnswer && (
            <>
              {documents[currentWord]?.document_image.length > 0 && (
                <ImageCarousel images={documents[currentWord]?.document_image} />
              )}
              <AudioPlayer document={documents[currentWord]} disabled={selectedAnswer === null} />
              <SingleChoice
                answers={answers}
                onClick={onClickAnswer}
                correctAnswer={correctAnswer}
                selectedAnswer={selectedAnswer}
                delayPassed={delayPassed}
              />
              <ButtonContainer>
                {selectedAnswer !== null && (
                  <Button onPress={onFinishWord} buttonTheme={BUTTONS_THEME.dark}>
                    <>
                      <LightLabelInput>
                        {currentWord + 1 >= count ? labels.exercises.showResults : labels.exercises.next}
                      </LightLabelInput>
                    </>
                  </Button>
                )}
              </ButtonContainer>
            </>
          )}
        </>
      </Loading>
    </ExerciseContainer>
  )
}

export default ChoiceExerciseScreen
