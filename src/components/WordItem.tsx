import React, { useState } from 'react'
import styled, { css } from 'styled-components/native'

import { Answer, Article } from '../constants/data'
import { getLabels, getArticleColor } from '../services/helpers'
import { ContentSecondary, ContentSecondaryLight } from './text/Content'

const Container = styled.Pressable<StyledListElementProps>`
  margin-bottom: ${props => props.theme.spacings.xxs};
  padding: ${props => props.theme.spacings.sm};
  border-radius: 2px;
  border-width: ${props => {
    if (props.pressed || props.selected || (props.correct && props.delayPassed)) {
      return '0px'
    }
    return '1px'
  }};
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border-color: ${props => props.theme.colors.disabled};
  background-color: ${props => {
    if (props.pressed) {
      return props.theme.colors.primary
    }
    if (props.correct && (props.selected || props.delayPassed)) {
      return props.theme.colors.correct
    }
    if (props.selected) {
      return props.theme.colors.incorrect
    }
    return props.theme.colors.backgroundAccent
  }};
  shadow-color: ${props => {
    if (props.correct) {
      return props.theme.colors.correct
    }
    if (props.selected) {
      return props.theme.colors.incorrect
    }
    return props.theme.colors.shadow
  }};
  ${props => {
    if (props.pressed || props.selected || (props.correct && props.delayPassed)) {
      return css`
        elevation: 6;
        shadow-opacity: 0.5;
      `
    }
    return css`
      elevation: 0;
      shadow-opacity: 0;
    `
  }};
  shadow-radius: 5px;
  shadow-offset: 5px 5px;
`

const ArticleBox = styled.View<StyledListElementProps & { article: Article }>`
  padding: ${props => `2px ${props.theme.spacings.xs}`};
  border-radius: ${props => props.theme.spacings.sm};
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: ${props => props.theme.spacings.sm};
  margin-left: ${props => props.theme.spacings.sm};
  background-color: ${props => {
    if (props.pressed) {
      return props.theme.colors.background
    }
    if (props.selected || (props.correct && props.delayPassed)) {
      return props.theme.colors.primary
    }
    return getArticleColor(props.article)
  }};
`

const ArticleText = styled(ContentSecondary)<StyledListElementProps>`
  text-align: center;
  color: ${props => {
    if (props.pressed) {
      return props.theme.colors.primary
    }
    if ((props.correct && props.selected) || (props.correct && props.delayPassed)) {
      return props.theme.colors.correct
    }
    if (props.selected) {
      return props.theme.colors.incorrect
    }
    return props.theme.colors.text
  }};
`

const Word = styled(ContentSecondaryLight)<StyledListElementProps>`
  color: ${props => {
    if (props.pressed) {
      return props.theme.colors.background
    }
    if (props.selected || (props.correct && props.delayPassed)) {
      return props.theme.colors.primary
    }
    return props.theme.colors.text
  }};
`

const Overlay = styled.View`
  background-color: rgba(255, 255, 255, 0.6);
  position: absolute;
  width: 100%;
  height: 100%;
`

export interface SingleChoiceListItemProps {
  answer: Answer
  correct?: boolean
  selected?: boolean
  anyAnswerSelected?: boolean
  delayPassed?: boolean
  onClick?: (answer: Answer) => void
  disabled?: boolean
}

interface StyledListElementProps {
  pressed: boolean
  selected: boolean
  correct: boolean
  delayPassed: boolean
}

const WordItem = ({
  answer,
  onClick,
  correct = false,
  selected = false,
  anyAnswerSelected = false,
  delayPassed = false,
  disabled = false,
}: SingleChoiceListItemProps): JSX.Element => {
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
    if (onClick) {
      setPressed(false)
      onClick(answer)
    }
  }

  return (
    <Container
      correct={showCorrect}
      selected={selected}
      onPressIn={onClick && onPressIn}
      onPressOut={onPressOut}
      pressed={pressed}
      delayPassed={delayPassed}
      disabled={anyAnswerSelected || disabled}>
      <ArticleBox
        article={article}
        selected={selected}
        correct={showCorrect}
        pressed={pressed}
        delayPassed={delayPassed}>
        <ArticleText selected={selected} correct={showCorrect} pressed={pressed} delayPassed={delayPassed}>
          {article.value}
        </ArticleText>
      </ArticleBox>
      <Word selected={selected} pressed={pressed} correct={showCorrect} delayPassed={delayPassed}>
        {word}
        {article.id === 4 && ` (${getLabels().general.plurals})`}
      </Word>
      {addOpacity && <Overlay />}
    </Container>
  )
}

export default WordItem
