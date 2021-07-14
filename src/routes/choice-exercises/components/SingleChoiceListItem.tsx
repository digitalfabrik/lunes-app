import React, { useState } from 'react'
import { getArticleColor } from '../../../services/helpers'
import { Answer, Article } from '../../../constants/data'
import { COLORS } from '../../../constants/colors'
import styled from 'styled-components/native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const StyledContainer = styled.TouchableOpacity`
  height: 23.5%;
  margin-bottom: 1.5%;
  border-radius: 2px;
  border-width: ${(props: { pressed: boolean; selected: boolean; correct: boolean; delayPassed: boolean }) => {
    if ((props.pressed || props.selected) || (props.correct && props.selected) || (props.correct && props.delayPassed)) {
      return '0px';
    } else {
      return '1px';
    }
  }};
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border-color: ${COLORS.lunesBlackUltralight};
  background-color: ${(props: { pressed: boolean; selected: boolean; correct: boolean; delayPassed: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesBlack
    } else if (props.correct && (props.selected || (!props.selected && props.delayPassed))) {
      return COLORS.lunesFunctionalCorrectDark
    } else if (props.selected && !props.correct) {
      return COLORS.lunesFunctionalIncorrectDark
    } else {
      return COLORS.white
    }
  }};
  shadowColor: ${(props: { pressed: boolean; selected: boolean; correct: boolean }) => {
    if (props.correct) {
      return COLORS.lunesFunctionalCorrectDark
    } else if (props.selected && !props.correct) {
      return COLORS.lunesFunctionalIncorrectDark
    } else {
      return COLORS.shadow
    }
  }};
  ${(props: { pressed: boolean; selected: boolean; correct: boolean; delayPassed: boolean }) => {
    if ((props.pressed || props.selected) || (props.correct && props.selected) || (props.correct && props.delayPassed)) {
      return 'elevation: 6; shadowOpacity: 0.5;'
    } else {
      return 'elevation: 0; shadowOpacity: 0;'
    }
  }};
  shadowRadius: 5px;
  shadowOffset: { width: 5, height: 5 };
`

const StyledArticleBox = styled.View`
  width: 11.5%;
  height: 38%;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3%;
  margin-left: 3.5%;
  background-color: ${(props: { pressed: boolean; selected: boolean; article: Article; correct: boolean; delayPassed: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesWhite
    } else if (props.selected || (props.correct && (props.selected || props.delayPassed))) {
      return COLORS.lunesBlack
    } else {
      return getArticleColor(props.article)
    }
  }};
`

const StyledArticleText = styled.Text`
  font-size: ${wp('4.3%')};
  font-weight: normal;
  font-family: SourceSansPro-Regular;
  text-align: center;
  color:  ${(props: { pressed: boolean; selected: boolean; correct: boolean; delayPassed: boolean }) => {
  if (props.pressed) {
    return COLORS.lunesBlack
  } else if ((props.correct && props.selected) || (props.correct && props.delayPassed)) {
    return COLORS.lunesFunctionalCorrectDark
  } else if (props.selected) {
    return COLORS.lunesFunctionalIncorrectDark
  } else {
    return COLORS.lunesGreyDark
  }
}};
`

const StyledWord = styled.Text`
  font-family: SourceSansPro-Regular;
  font-size: ${wp('4.3%')};
  font-weight: normal;
  font-style: normal;
  color: ${(props: { pressed: boolean; selected: boolean; correct: boolean; delayPassed: boolean }) => {
    if (props.pressed) {
      return COLORS.lunesWhite
    } else if (props.selected || (props.correct && props.delayPassed)) {
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
  delayPassed: boolean
}

const SingleChoiceListItem = ({
  answer,
  onClick,
  correct,
  selected,
  anyAnswerSelected,
  delayPassed
}: SingleChoiceListItemPropsType): JSX.Element => {
  const [pressed, setPressed] = useState<boolean>(false)
  const { word, article } = answer
  const addOpacity = anyAnswerSelected && ((!correct && !selected) || (correct && !delayPassed && !selected) || (!correct && selected && delayPassed))
  const showCorrect = anyAnswerSelected && correct

  const onPressIn = (): void => {
    setPressed(true)
  }

  const onPressOut = (): void => {
    setPressed(false)
    onClick(answer)
  }

  return (
    <StyledContainer activeOpacity={1}
      correct={showCorrect}
      selected={selected}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      pressed={pressed}
      delayPassed={delayPassed}
      disabled={anyAnswerSelected}>
      <StyledArticleBox article={article} selected={selected} correct={showCorrect} pressed={pressed} delayPassed={delayPassed}>
        <StyledArticleText selected={selected} correct={showCorrect} pressed={pressed} delayPassed={delayPassed}>
          {article.value}
        </StyledArticleText>
      </StyledArticleBox>
      <StyledWord selected={selected} pressed={pressed} correct={showCorrect} delayPassed={delayPassed}>
        {word}
      </StyledWord>
      {addOpacity && <StyledOpacityOverlay />}
    </StyledContainer>
  )
}

export default SingleChoiceListItem
