import React, { useState } from 'react'
import { getArticleColor } from '../../../services/helpers'
import { Answer, Article } from '../../../constants/data'
import styled, { css } from 'styled-components/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

interface StyledListElementProps {
  pressed: boolean
  selected: boolean
  correct: boolean
  delayPassed: boolean
}

const StyledText = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-size: ${wp('4.3%')}px;
  font-weight: normal;
  font-style: normal;
`

const StyledContainer = styled.TouchableOpacity<StyledListElementProps>`
  height: 23.5%;
  margin-bottom: 1.5%;
  border-radius: 2px;
  border-width: ${props => {
    if (props.pressed || props.selected || (props.correct && props.delayPassed)) {
      return '0px'
    } else {
      return '1px'
    }
  }};
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border-color: ${props => props.theme.colors.lunesBlackUltralight};
  background-color: ${props => {
    if (props.pressed) {
      return props.theme.colors.lunesBlack
    } else if (props.correct && (props.selected || props.delayPassed)) {
      return props.theme.colors.lunesFunctionalCorrectDark
    } else if (props.selected) {
      return props.theme.colors.lunesFunctionalIncorrectDark
    } else {
      return props.theme.colors.white
    }
  }};
  shadow-color: ${props => {
    if (props.correct) {
      return props.theme.colors.lunesFunctionalCorrectDark
    } else if (props.selected && !props.correct) {
      return props.theme.colors.lunesFunctionalIncorrectDark
    } else {
      return props.theme.colors.shadow
    }
  }};
  ${props => {
    if (props.pressed || props.selected || (props.correct && props.selected) || (props.correct && props.delayPassed)) {
      return css`
        elevation: 6;
        shadow-opacity: 0.5;
      `
    } else {
      return css`
        elevation: 0;
        shadow-opacity: 0;
      `
    }
  }};
  shadow-radius: 5px;
  shadow-offset: 5px 5px;
`

const StyledArticleBox = styled.View<StyledListElementProps & { article: Article }>`
  width: 11.5%;
  height: 38%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3%;
  margin-left: 3.5%;
  background-color: ${props => {
    if (props.pressed) {
      return props.theme.colors.lunesWhite
    } else if (props.selected || (props.correct && props.delayPassed)) {
      return props.theme.colors.lunesBlack
    } else {
      return getArticleColor(props.article)
    }
  }};
`

const StyledArticleText = styled(StyledText)<StyledListElementProps>`
  text-align: center;
  color: ${props => {
    if (props.pressed) {
      return props.theme.colors.lunesBlack
    } else if ((props.correct && props.selected) || (props.correct && props.delayPassed)) {
      return props.theme.colors.lunesFunctionalCorrectDark
    } else if (props.selected) {
      return props.theme.colors.lunesFunctionalIncorrectDark
    } else {
      return props.theme.colors.lunesGreyDark
    }
  }};
`

const StyledWord = styled(StyledText)<StyledListElementProps>`
  color: ${props => {
    if (props.pressed) {
      return props.theme.colors.lunesWhite
    } else if (props.selected || (props.correct && props.delayPassed)) {
      return props.theme.colors.lunesBlack
    } else {
      return props.theme.colors.lunesGreyDark
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
  delayPassed: boolean
  disabled?: boolean
}

const SingleChoiceListItem = ({
  answer,
  onClick,
  correct,
  selected,
  anyAnswerSelected,
  delayPassed,
  disabled = false
}: SingleChoiceListItemPropsType): JSX.Element => {
  const [pressed, setPressed] = useState<boolean>(false)
  const { word, article } = answer
  const addOpacity =
    anyAnswerSelected &&
    ((!correct && !selected) || (correct && !delayPassed && !selected) || (!correct && selected && delayPassed))
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
      activeOpacity={1}
      correct={showCorrect}
      selected={selected}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      pressed={pressed}
      delayPassed={delayPassed}
      disabled={anyAnswerSelected || disabled}>
      <StyledArticleBox
        article={article}
        selected={selected}
        correct={showCorrect}
        pressed={pressed}
        delayPassed={delayPassed}>
        <StyledArticleText selected={selected} correct={showCorrect} pressed={pressed} delayPassed={delayPassed}>
          {article.value}
        </StyledArticleText>
      </StyledArticleBox>
      <StyledWord selected={selected} pressed={pressed} correct={showCorrect} delayPassed={delayPassed}>
        {word} {article.id === 4 ? "(plural)" : " "}
      </StyledWord>
      {addOpacity && <StyledOpacityOverlay />}
    </StyledContainer>
  )
}

export default SingleChoiceListItem
