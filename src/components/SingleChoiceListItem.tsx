import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { capitalizeFirstLetter, getArticleColor } from '../utils/helpers'
import { ARTICLES } from '../constants/data'
import { COLORS } from '../constants/colors'
import styled from 'styled-components/native'

const StyledContainer = styled.View`
  height: 55px;
  margin-bottom: 5px;
  border-radius: 2px;
  border-width: 1px;
  border-color: ${COLORS.lunesBlackUltralight};
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
`

const StyledContainerClicked = styled(StyledContainer)`
  background-color: ${COLORS.lunesBlack};
  border-color: ${COLORS.lunesBlackUltralight};
`

const StyledContainerCorrect = styled(StyledContainer)`
  background-color: ${COLORS.lunesFunctionalCorrectDark};
  border-color: ${COLORS.lunesBlackUltralight};
`

const StyledContainerIncorrect = styled(StyledContainer)`
  background-color: ${COLORS.lunesFunctionalIncorrectDark};
  border-color: ${COLORS.lunesBlackUltralight};
`

const StyledArticle = styled.Text`
  width: 37px;
  height: 21px;
  font-size: 14px;
  font-weight: normal;
  border-radius: 10px;
  color: ${COLORS.lunesGreyDark};
  font-family: SourceSansPro-Regular;
  overflow: hidden;
  text-align: center;
  margin-right: 7px;
  margin-left: 11px;
  align-self: flex-start;
  margin-top: 17px;
  background-color: ${(props: any) => getArticleColor(props.article)};
`

const StyledArticleClicked = styled(StyledArticle)`
  color: ${COLORS.lunesBlack};
  background-color: ${COLORS.lunesWhite};
`

const StyledArticleCorrect = styled(StyledArticle)`
  color: ${COLORS.lunesFunctionalCorrectDark};
  background-color: ${COLORS.lunesBlack};
`

const StyledArticleIncorrect = styled(StyledArticle)`
  color: ${COLORS.lunesFunctionalIncorrectDark};
  background-color: ${COLORS.lunesBlack};
`

const StyledWord = styled.Text`
  height: 18px;
  font-family: SourceSansPro;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  color: ${COLORS.lunesGreyDark};
`
const StyledWordClicked = styled(StyledWord)`
  color: ${COLORS.lunesWhite};
`

const StyledWordEvaluated = styled(StyledWord)`
  color: ${COLORS.lunesBlack};
`

export interface ISingleChoiceListItemProps {
  word: string
  article: string
  correct: boolean
  selected: boolean
  addOpacity: boolean
}

const SingleChoiceListItem = ({ word, article, correct, selected, addOpacity }: ISingleChoiceListItemProps) => {
  const [Container, setContainer] = useState<styled.Component>(StyledContainer)
  const [Article, setArticle] = useState<styled.Component>(StyledArticle)
  const [Word, setWord] = useState<styled.Component>(StyledWord)

  useEffect(() => {
    console.log(typeof Word)
    if (selected) {
      setContainer(StyledContainerClicked)
      setArticle(StyledArticleClicked)
      setWord(StyledWordClicked)
      setTimeout(() => {
        if (correct) {
          setContainer(StyledContainerCorrect)
          setWord(StyledWordEvaluated)
          setArticle(StyledArticleCorrect)
        } else {
          setContainer(StyledContainerIncorrect)
          setArticle(StyledArticleIncorrect)
          setWord(StyledWordEvaluated)
          setArticle(StyledArticleIncorrect)
        }
      }, 400)
    }
  }, [])

  return (
    <Container>
      <Article testID='article' article={article}>
        {article?.toLowerCase() === ARTICLES.diePlural ? 'Die' : capitalizeFirstLetter(article)}
      </Article>
      <Word testID='word'>{word}</Word>
      {addOpacity && (
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </Container>
  )
}

export default SingleChoiceListItem
