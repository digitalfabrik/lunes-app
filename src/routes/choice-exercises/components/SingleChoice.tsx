import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import WordItem from '../../../components/WordItem'
import { Answer } from '../../../constants/data'

export const StyledContainer = styled.View`
  margin-top: ${props => props.theme.spacings.md};
  height: ${hp('36.3%')}px;
  width: 85%;
  align-self: center;
`

export interface SingleChoiceProps {
  onClick: (answer: Answer) => void
  answers: Answer[]
  correctAnswers: Answer[]
  selectedAnswer: Answer | null
  delayPassed: boolean
}

export const SingleChoice = ({
  answers,
  onClick,
  correctAnswers,
  selectedAnswer,
  delayPassed,
}: SingleChoiceProps): ReactElement => {
  const isAnswerEqual = (answer1: Answer, answer2: Answer | null): boolean =>
    answer2 !== null && answer1.article === answer2.article && answer1.word === answer2.word

  return (
    <StyledContainer>
      {answers.map(answer => (
        <WordItem
          key={`${answer.article.id}-${answer.word}`}
          answer={answer}
          onClick={onClick}
          correct={correctAnswers.some(it => isAnswerEqual(answer, it))}
          selected={isAnswerEqual(answer, selectedAnswer)}
          anyAnswerSelected={selectedAnswer !== null}
          delayPassed={delayPassed}
        />
      ))}
    </StyledContainer>
  )
}
