import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import styled from 'styled-components/native'

import { Answer, Article, isArticlePlural } from '../constants/data'
import { getLabels, getArticleColor } from '../services/helpers'
import { hyphenated } from '../services/hyphenation'
import { Content, ContentSecondary } from './text/Content'
import { VocabularyWord } from './text/Heading'

const PRESSED_ELEVATION = 6
const PRESSED_SHADOW_OPACITY = 0.5

const Container = styled.View<StyledListElementProps>`
  margin-bottom: ${props => props.theme.spacings.xxs};
  padding: ${props => props.theme.spacings.sm};
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  border-color: ${props => props.theme.colors.disabled};
  background-color: ${props => (props.pressed ? props.theme.colors.primary : props.theme.colors.backgroundAccent)};
  elevation: ${props => (props.pressed ? PRESSED_ELEVATION : 0)};
  shadow-color: ${props => props.theme.colors.shadow};
  shadow-opacity: ${props => (props.pressed ? PRESSED_SHADOW_OPACITY : 0)};
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
  background-color: ${props => (props.pressed ? props.theme.colors.background : getArticleColor(props.article))};
`

const ArticleText = styled(ContentSecondary)<StyledListElementProps>`
  text-align: center;
  color: ${props => (props.pressed ? props.theme.colors.primary : props.theme.colors.text)};
`

const Word = styled(Content)<StyledListElementProps>`
  color: ${props => (props.pressed ? props.theme.colors.background : props.theme.colors.text)};
`

const PrimaryWord = styled(VocabularyWord)<StyledListElementProps>`
  color: ${props => (props.pressed ? props.theme.colors.background : props.theme.colors.text)};
`

export type SingleChoiceListItemProps = {
  answer: Answer
  anyAnswerSelected?: boolean
  onClick?: (answer: Answer) => void
  isPrimaryContent?: boolean
}

type StyledListElementProps = {
  pressed: boolean
}

const WordItem = ({
  answer,
  onClick,
  anyAnswerSelected = false,
  isPrimaryContent = false,
}: SingleChoiceListItemProps): ReactElement => {
  const { word, article } = answer
  const WordText = isPrimaryContent ? PrimaryWord : Word
  const displayedWord = isArticlePlural(article) ? `${word} (${getLabels().general.plurals})` : word

  return (
    <Pressable onPress={onClick ? () => onClick(answer) : undefined} disabled={anyAnswerSelected} testID='word-item'>
      {({ pressed }) => (
        <Container pressed={pressed}>
          <ArticleBox article={article} pressed={pressed}>
            <ArticleText pressed={pressed}>{article.value}</ArticleText>
          </ArticleBox>
          <WordText pressed={pressed} {...hyphenated(displayedWord)} />
        </Container>
      )}
    </Pressable>
  )
}

export default WordItem
