import React, { useState } from 'react'
import { getArticleColor } from '../../../utils/helpers'
import { Answer, Article } from '../../../constants/data'
import { COLORS } from '../../../constants/colors'
import styled from 'styled-components/native'

const StyledContainer = styled.TouchableOpacity`
  height: 55px;
  margin-bottom: 1.5%;
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: baseline;
  border-color: ${props => {
    if (props.pressed || props.selected) {
      return 'transparent'
    } else {
      return COLORS.lunesBlackUltralight
    }
  }};
  background-color: ${(props: { pressed: boolean; selected: boolean; correct: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesBlack
    } else if (props.correct) {
      return COLORS.lunesFunctionalCorrectDark
    } else if (props.selected && !props.correct) {
      return COLORS.lunesFunctionalIncorrectDark
    } else {
      return COLORS.lunesWhite
    }
  }};
`

const StyledArticle = styled.Text`
  width: 11.5%;
  height: 38%;
  font-size: 14px;
  font-weight: normal;
  border-radius: 10px;
  font-family: SourceSansPro-Regular;
  overflow: hidden;
  text-align: center;
  margin-right: 3%;
  margin-left: 3.5%;
  color:  ${(props: { pressed: boolean; selected: boolean; correct: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesBlack
    } else if (props.selected) {
      if (props.correct) {
        return COLORS.lunesFunctionalCorrectDark
      } else {
        return COLORS.lunesFunctionalIncorrectDark
      }
    } else {
      return COLORS.lunesGreyDark
    }
  }};
  background-color: ${(props: { pressed: boolean; selected: boolean; article: Article; correct: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesWhite
    } else if (props.selected) {
      return COLORS.lunesBlack
    } else {
      return getArticleColor(props.article)
    }
  }}};
`

const StyledWord = styled.Text`
  margin-top: 17px;
  font-family: SourceSansPro-Regular;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  color: ${(props: { pressed: boolean; selected: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesWhite
    } else if (props.selected) {
      return COLORS.lunesBlack
    } else {
      return COLORS.lunesGreyDark
    }
  }};
`

const StyledOpacityOverlay = styled.View`
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  width: 100%;
  height: 100%;
`

export interface SingleChoiceListItemPropsType {
  answer: Answer
  onClick: (answer: Answer) => void
  correct: boolean
  selected: boolean
  anyAnswerSelected: boolean
}

const SingleChoiceListItem = ({
  answer,
  onClick,
  correct,
  selected,
  anyAnswerSelected
}: SingleChoiceListItemPropsType): JSX.Element => {
  const [pressed, setPressed] = useState<boolean>(false)
  const { word, article } = answer
  const addOpacity = anyAnswerSelected && !correct
  const showCorrect = anyAnswerSelected && correct

  const onPressIn = (): void => {
    setPressed(true)
  }

  const onPressOut = (): void => {
    setPressed(false)
    onClick(answer)
  }

  return (
    <StyledContainer
      correct={showCorrect}
      selected={selected}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      pressed={pressed}
      disabled={anyAnswerSelected}>
      <StyledArticle article={article} selected={selected} correct={showCorrect} pressed={pressed}>
        {article.value}
      </StyledArticle>
      <StyledWord selected={selected} pressed={pressed}>
        {word}
      </StyledWord>
      {addOpacity && <StyledOpacityOverlay />}
    </StyledContainer>
  )
}

export default SingleChoiceListItem
