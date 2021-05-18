import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { capitalizeFirstLetter, getArticleColor } from '../utils/helpers'
import { ARTICLES } from '../constants/data'
import { COLORS } from '../constants/colors'
import styled from 'styled-components/native'

const StyledContainer = styled.View`
  height: 55px;
  marginbottom: 5px;
  borderradius: 2px;
  borderwidth: 1px;
  bordercolor: ${COLORS.lunesBlackUltralight};
  borderstyle: solid;
  display: flex;
  justifycontent: flex-start;
  flexdirection: row;
  align-items: center;
`

const StyledContainerClicked = styled(StyledContainer)`
  backgroundcolor: ${COLORS.lunesBlack};
  bordercolor: ${COLORS.lunesBlackUltralight};
`

const StyledContainerCorrect = styled(StyledContainer)`
  backgroundcolor: ${COLORS.lunesFunctionalCorrectDark};
  bordercolor: ${COLORS.lunesBlackUltralight};
`

const StyledContainerIncorrect = styled(StyledContainer)`
  backgroundcolor: ${COLORS.lunesFunctionalIncorrectDark};
  bordercolor: ${COLORS.lunesBlackUltralight};
`

const StyledArticle = styled.Text`
  width: 37px;
  height: 21px;
  fontsize: 14px;
  fontweight: normal;
  borderradius: 10px;
  color: ${COLORS.lunesGreyDark};
  fontfamily: SourceSansPro-Regular;
  overflow: hidden;
  textalign: center;
  marginright: 7px;
  marginleft: 11px;
  alignself: flex-start;
  margintop: 17px;
  backgroundcolor: ${(props: any) => getArticleColor(props.article)};
`

const StyledArticleClicked = styled(StyledArticle)`
  color: ${COLORS.lunesBlack};
  backgroundcolor: ${COLORS.lunesWhite};
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
  fontfamily: SourceSansPro;
  fontsize: 14px;
  fontweight: normal;
  fontstyle: normal;
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
