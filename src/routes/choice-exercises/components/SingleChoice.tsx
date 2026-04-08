import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import WordItem from '../../../components/WordItem'
import { Answer } from '../../../constants/data'

export const StyledContainer = styled.View`
  margin-top: ${props => props.theme.spacings.md};
  width: 85%;
  align-self: center;
`

export type SingleChoiceProps = {
  onClick: (answer: Answer) => void
  answers: Answer[]
  selectedAnswer: Answer | null
}

export const SingleChoice = ({ answers, onClick, selectedAnswer }: SingleChoiceProps): ReactElement => (
  <StyledContainer>
    {answers.map(answer => (
      <WordItem
        key={`${answer.article.id}-${answer.word}`}
        answer={answer}
        onClick={onClick}
        anyAnswerSelected={selectedAnswer !== null}
      />
    ))}
  </StyledContainer>
)
