import React from 'react'
import SingleChoiceListItem from './SingleChoiceListItem'
import styled from 'styled-components/native'
import { Answer } from '../../../constants/data'

export const StyledContainer = styled.View`
  padding-top: 10px;
  margin-horizontal: 8%;
`

export interface SingleChoicePropsType {
  onClick: (answer: Answer) => void
  answers: Answer[]
  correctAnswer: Answer
  selectedAnswer: Answer | null
}

export const SingleChoice = ({ answers, onClick, correctAnswer, selectedAnswer }: SingleChoicePropsType) => {
  return (
    <StyledContainer>
      {answers.map((answer, index) => {
        return (
          <SingleChoiceListItem
            key={index}
            answer={answer}
            onClick={onClick}
            correct={answer === correctAnswer}
            selected={answer === selectedAnswer}
            anyAnswerSelected={selectedAnswer !== null}
          />
        )
      })}
    </StyledContainer>
  )
}
