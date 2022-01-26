import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { Answer } from '../../../constants/data'
import SingleChoiceListItem from './SingleChoiceListItem'

export const StyledContainer = styled.View`
  padding-top: 6%;
  height: 42%;
  margin-left: 8%;
  margin-right: 8%;
`

export interface SingleChoiceProps {
  onClick: (answer: Answer) => void
  answers: Answer[]
  correctAnswer: Answer
  selectedAnswer: Answer | null
  delayPassed: boolean
}

export const SingleChoice = ({
  answers,
  onClick,
  correctAnswer,
  selectedAnswer,
  delayPassed
}: SingleChoiceProps): ReactElement => {
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
