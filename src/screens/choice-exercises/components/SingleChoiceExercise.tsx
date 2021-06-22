import React, { useEffect, useState } from 'react'
import { SingleChoice } from './SingleChoice'
import { DocumentType } from '../../../constants/endpoints'
import { DocumentResultType } from '../../../navigation/NavigationTypes'
import { Answer, BUTTONS_THEME, SIMPLE_RESULTS } from '../../../constants/data'
import Button from '../../../components/Button'
import { Text } from 'react-native'
import { WhiteNextArrow } from '../../../../assets/images'
import { styles } from '../../../components/Actions'
import styled from 'styled-components/native'
import AudioPlayer from '../../../components/AudioPlayer'
import labels from '../../../constants/labels.json'

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
}

const ChoiceExerciseScreen = ({ documents, documentToAnswers, onExerciseFinished }: SingleChoiceExercisePropsType) => {
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
    return answer1.article === answer2.article && answer1.word === answer2.word
  }

  const isCorrectAlternative = (selectedAnswer: Answer): boolean => {
    let found = false
    currentDocument.alternatives.forEach(alternative => {
      if (alternative.article === selectedAnswer.article && alternative.alt_word === selectedAnswer.word) {
        setCorrectAnswer(selectedAnswer)
        found = true
      }
    })
    return found
  }

  const onClickAnswer = (selectedAnswer: Answer) => {
    setSelectedAnswer(selectedAnswer)

    if (isAnswerEqual(selectedAnswer, correctAnswer) || isCorrectAlternative(selectedAnswer)) {
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
      onExerciseFinished(results)
    } else {
      setCurrentWord(prevState => prevState + 1)
      setSelectedAnswer(null)
    }
  }

  return (
    <>
      <StyledImage
        source={{
          uri: documents[currentWord]?.document_image[0].image
        }}
      />
      <AudioPlayer document={documents[currentWord]} disabled={selectedAnswer === null} />
      <SingleChoice
        answers={answers}
        onClick={onClickAnswer}
        correctAnswer={correctAnswer}
        selectedAnswer={selectedAnswer}
      />
      <ButtonContainer>
        {selectedAnswer !== null && (
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
