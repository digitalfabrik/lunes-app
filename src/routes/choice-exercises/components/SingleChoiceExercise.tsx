import React, { useEffect, useState } from 'react'
import { SingleChoice } from './SingleChoice'
import { DocumentType } from '../../../constants/endpoints'
import { DocumentResultType, RoutesParamsType } from '../../../navigation/NavigationTypes'
import { Answer, ARTICLES, BUTTONS_THEME, SIMPLE_RESULTS } from '../../../constants/data'
import Button from '../../../components/Button'
import { Text } from 'react-native'
import { NextArrow, WhiteNextArrow } from '../../../../assets/images'
import { styles } from '../../write-exercise/components/Actions'
import styled from 'styled-components/native'
import AudioPlayer from '../../../components/AudioPlayer'
import labels from '../../../constants/labels.json'
import ExerciseHeader from '../../../components/ExerciseHeader'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'

const StyledImage = styled.Image`
  width: 100%;
  height: 35%;
  position: relative;
`

const ButtonContainer = styled.View`
  align-items: center;
  margin: 20px 0;
`

interface SingleChoiceExercisePropsType {
  documents: DocumentType[]
  documentToAnswers: (document: DocumentType) => Answer[]
  onExerciseFinished: (results: DocumentResultType[]) => void
  navigation: StackNavigationProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
  route: RouteProp<RoutesParamsType, 'WordChoiceExercise' | 'ArticleChoiceExercise'>
}

const ChoiceExerciseScreen = ({
  documents,
  documentToAnswers,
  onExerciseFinished,
  navigation,
  route
}: SingleChoiceExercisePropsType) => {
  const [currentWord, setCurrentWord] = useState<number>(0)
  const currentDocument = documents[currentWord]
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)
  const [results, setResults] = useState<DocumentResultType[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [correctAnswer, setCorrectAnswer] = useState<Answer>({
    article: currentDocument.article,
    word: currentDocument.word
  })

  // Prevent regenerating false answers on every render
  useEffect(() => {
    setAnswers(documentToAnswers(currentDocument))
    setCorrectAnswer({ word: currentDocument.word, article: currentDocument.article })
  }, [currentDocument, documentToAnswers])

  const count = documents.length

  const isAnswerEqual = (answer1: Answer, answer2: Answer): boolean => {
    return answer1.article.id === answer2.article.id && answer1.word === answer2.word
  }

  const correctAlternatives: Answer[] = currentDocument.alternatives.map(it => ({
    article: ARTICLES[it.article],
    word: it.alt_word
  }))

  const onClickAnswer = (selectedAnswer: Answer) => {
    setSelectedAnswer(selectedAnswer)
    const correctSelected = [correctAnswer, ...correctAlternatives].find(it => isAnswerEqual(it, selectedAnswer))

    if (correctSelected !== undefined) {
      setCorrectAnswer(selectedAnswer)
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.correct }
      setResults([...results, result])
    } else {
      const result: DocumentResultType = { ...documents[currentWord], result: SIMPLE_RESULTS.incorrect }
      setResults([...results, result])
    }
  }

  const onFinishWord = () => {
    const exerciseFinished = currentWord + 1 >= count
    if (exerciseFinished) {
      setCurrentWord(0)
      setSelectedAnswer(null)
      onExerciseFinished(results)
      setCurrentWord(0)
      setResults([])
      setSelectedAnswer(null)
    } else {
      setCurrentWord(prevState => prevState + 1)
      setSelectedAnswer(null)
    }
  }

  return (
    <>
      <ExerciseHeader
        navigation={navigation}
        route={route}
        currentWord={currentWord}
        numberOfWords={documents.length}
      />
      {documents[currentWord]?.document_image.length > 0 && (
        <StyledImage
          source={{
            uri: documents[currentWord]?.document_image[0].image
          }}
        />
      )}
      <AudioPlayer document={documents[currentWord]} disabled={selectedAnswer === null} />
      <SingleChoice
        answers={answers}
        onClick={onClickAnswer}
        correctAnswer={correctAnswer}
        selectedAnswer={selectedAnswer}
      />
      <ButtonContainer>
        {selectedAnswer === null ? (
          <Button onPress={() => {}}>
            <>
              <Text style={styles.darkLabel}>{labels.exercises.write.tryLater}</Text>
              <NextArrow style={styles.arrow} />
            </>
          </Button>
        ) : (
          <Button onPress={onFinishWord} theme={BUTTONS_THEME.dark}>
            <>
              <Text style={[styles.lightLabel, styles.arrowLabel]}>
                {currentWord + 1 >= count ? labels.exercises.showResults : labels.exercises.next}
              </Text>
              <WhiteNextArrow />
            </>
          </Button>
        )}
      </ButtonContainer>
    </>
  )
}

export default ChoiceExerciseScreen
