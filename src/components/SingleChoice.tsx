import React from 'react'
import { StyleSheet, View } from 'react-native'
import SingleChoiceListItem, { SingleChoiceListItemPropsType } from './SingleChoiceListItem'
import styled from 'styled-components/native'

export const StyledContainer = styled.View`
  margin-horizontal: 8%;
`

export interface SingleChoicePropsType {
  answerOptions: SingleChoiceListItemPropsType[]
}

export const SingleChoice = ({ answerOptions }: SingleChoicePropsType) => {
  return (
    <StyledContainer>
      {answerOptions.map((answerOption, index) => {
        return <SingleChoiceListItem key={index} {...answerOption} />
      })}
    </StyledContainer>
  )
}
