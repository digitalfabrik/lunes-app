import React from 'react'
import SingleChoiceListItem, { SingleChoiceListItemType } from './SingleChoiceListItem'
import styled from 'styled-components/native'
import { Answer, Article } from '../../../constants/data'

export const StyledContainer = styled.View`
  padding-top: 10px;
  margin-horizontal: 8%;
`

export interface SingleChoicePropsType {
  onClick: (answer: Answer) => void
  answerOptions: SingleChoiceListItemType[]
  isAnswerClicked: boolean
}

export const SingleChoice = ({ answerOptions, onClick, isAnswerClicked }: SingleChoicePropsType) => {
  return (
    <StyledContainer>
      {answerOptions.map((answerOption, index) => {
        return (
          <SingleChoiceListItem
            key={index}
            answerOption={answerOption}
            onClick={onClick}
            isAnswerClicked={isAnswerClicked}
          />
        )
      })}
    </StyledContainer>
  )
}
