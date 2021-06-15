import React from 'react'
import { capitalizeFirstLetter, getArticleColor } from '../utils/helpers'
import { Answer, Article, ARTICLES } from '../constants/data'
import { COLORS } from '../constants/colors'
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
  background-color: ${(props: { pressed: boolean; selected: boolean; correct: boolean; onPress: any }) => {
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
  font-family: SourceSansPro;
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
  answerOption: SingleChoiceListItemType
  onClick: (answer: Answer) => void
  isAnswerClicked: boolean
}

export interface SingleChoiceListItemType {
  word: string
  article: Article
  pressed: boolean
  correct: boolean
  selected: boolean
  addOpacity: boolean
}

const SingleChoiceListItem = ({ answerOption, onClick, isAnswerClicked }: SingleChoiceListItemPropsType) => {
  const { word, article, pressed, correct, selected, addOpacity } = answerOption
  return (
    <StyledContainer
      pressed={pressed}
      correct={correct}
      selected={selected}
      onPress={() => onClick({article, word})}
      disabled={isAnswerClicked}>
      <StyledArticle article={article} selected={selected} correct={correct} pressed={pressed}>
        {article.toLowerCase() === ARTICLES.diePlural ? 'Die' : capitalizeFirstLetter(article)}
      </StyledArticle>
      <StyledWord pressed={pressed} selected={selected}>
        {word}
      </StyledWord>
      {addOpacity && <StyledOpacityOverlay />}
    </StyledContainer>
  )
}

export default SingleChoiceListItem
