import React from 'react'
import SingleChoiceListItem, { SingleChoiceListItemType } from './SingleChoiceListItem'
import styled from 'styled-components/native'
import { Article } from '../constants/data'

export const StyledContainer = styled.View`
  padding-top: 10px;
  margin-horizontal: 8%;
`

export interface SingleChoicePropsType {
  onClick: (article: Article) => void
  answerOptions: SingleChoiceListItemType[]
  isFinished: boolean
}

export const SingleChoice = ({ answerOptions, onClick, isFinished }: SingleChoicePropsType) => {
  return (
    <StyledContainer>
      {answerOptions.map((answerOption, index) => {
        return (
          <SingleChoiceListItem key={index} answerOption={answerOption} onClick={onClick} isFinished={isFinished} />
        )
      })}
    </StyledContainer>
  )
}
