import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Answer } from '../../../constants/data'
import SingleChoiceListItem from './SingleChoiceListItem'

export const StyledContainer = styled.View`
  padding-top: ${props => props.theme.spacings.md};
  height: ${hp('42%')}px;
  margin-left: ${props => props.theme.spacings.md};
  margin-right: ${props => props.theme.spacings.md};
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
  const isAnswerEqual = (answer1: Answer, answer2: Answer | null): boolean =>
    answer2 !== null && answer1.article === answer2.article && answer1.word === answer2.word

  return (
    <StyledContainer>
      {answers.map(answer => (
        <SingleChoiceListItem
          key={`${answer.article.id}-${answer.word}`}
          answer={answer}
          onClick={onClick}
          correct={isAnswerEqual(answer, correctAnswer)}
          selected={isAnswerEqual(answer, selectedAnswer)}
          anyAnswerSelected={selectedAnswer !== null}
          delayPassed={delayPassed}
        />
      ))}
    </StyledContainer>
  )
}
