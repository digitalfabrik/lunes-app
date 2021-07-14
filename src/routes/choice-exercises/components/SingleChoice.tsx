import React from 'react'
import SingleChoiceListItem from './SingleChoiceListItem'
import styled from 'styled-components/native'
import { Answer } from '../../../constants/data'

export const StyledContainer = styled.View`
  padding-top: 6%;
  height: 42%;
  margin-horizontal: 8%;
`

export interface SingleChoicePropsType {
  onClick: (answer: Answer) => void
  answers: Answer[]
  correctAnswer: Answer
  selectedAnswer: Answer | null
  delayPassed: boolean
}

export const SingleChoice = ({ answers, onClick, correctAnswer, selectedAnswer, delayPassed }: SingleChoicePropsType) => {
  const isAnswerEqual = (answer1: Answer, answer2: Answer | null): boolean => {
    return answer2 !== null && answer1.article === answer2.article && answer1.word === answer2.word
  }

  return (
    <StyledContainer>
      {answers.map((answer, index) => {
        return (
          <SingleChoiceListItem
            key={index}
            answer={answer}
            onClick={onClick}
            correct={isAnswerEqual(answer, correctAnswer)}
            selected={isAnswerEqual(answer, selectedAnswer)}
            anyAnswerSelected={selectedAnswer !== null}
            delayPassed={delayPassed}
          />
        )
      })}
    </StyledContainer>
  )
}
