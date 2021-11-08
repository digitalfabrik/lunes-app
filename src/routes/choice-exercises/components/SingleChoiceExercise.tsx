import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useEffect, useState, useCallback } from 'react'
import styled from 'styled-components/native'

import { NextArrow } from '../../../../assets/images'
import AudioPlayer from '../../../components/AudioPlayer'
import Button from '../../../components/Button'
import ExerciseHeader from '../../../components/ExerciseHeader'
import ImageCarousel from '../../../components/ImageCarousel'
import { Answer, BUTTONS_THEME, SIMPLE_RESULTS } from '../../../constants/data'
import { AlternativeWordType, DocumentType } from '../../../constants/endpoints'
import labels from '../../../constants/labels.json'
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
  data: DocumentType[]
  documentToAnswers: (document: DocumentType) => Answer[]
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  exerciseKey: number
}

const ChoiceExerciseScreen = ({
  data,
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
  const correctAnswerDelay = 700
  const [delayPassed, setDelayPassed] = useState<boolean>(false)
  const documents = newDocuments ?? data
  const currentDocument = documents[currentWord]
  const [correctAnswer, setCorrectAnswer] = useState<Answer>({
    article: currentDocument.article,
    word: currentDocument.word
  })

  // Prevent regenerating false answers on every render
  useEffect(() => {
    setAnswers(documentToAnswers(currentDocument))
    setCorrectAnswer({ word: currentDocument.word, article: currentDocument.article })
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

  const count = documents.length

  const isAnswerEqual = (answer1: Answer | AlternativeWordType, answer2: Answer): boolean => {
    return answer1.article.id === answer2.article.id && answer1.word === answer2.word
  }

  const onClickAnswer = (clickedAnswer: Answer): void => {
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
      setResults([])
    } else {
      setCurrentWord(prevState => prevState + 1)
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
        numberOfWords={documents.length}
      />
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
        {selectedAnswer !== null ? (
          <Button onPress={onFinishWord} buttonTheme={BUTTONS_THEME.dark}>
            <LightLabelInput>{lastWord ? labels.exercises.showResults : labels.exercises.next}</LightLabelInput>
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
    </ExerciseContainer>
  )
}

export default ChoiceExerciseScreen
