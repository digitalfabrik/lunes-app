import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import AudioPlayer from '../../../components/AudioPlayer'
import ListItem from '../../../components/ListItem'
import { Document } from '../../../constants/endpoints'
import { getArticleColor } from '../../../services/helpers'

const StyledImage = styled.Image`
  margin-right: 5px;
  width: ${wp('15%')}px;
  height: ${wp('15%')}px;
  border-radius: 50px;
`
const StyledTitle = styled.Text<{ articleColor: string }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  border-radius: 10px;
  margin-bottom: 6px;
  color: ${props => props.theme.colors.lunesGreyDark};
  background-color: ${props => props.articleColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: flex-start;
  width: ${wp('10%')}px;
  overflow: hidden;
  height: ${wp('5%')}px;
  text-align: center;
`
const Speaker = styled.View`
  padding-right: 40px;
  padding-top: 20px;
`

export interface VocabularyListItemProp {
  document: Document
  setIsModalVisible?: () => void
}

const VocabularyListItem = ({ document, setIsModalVisible }: VocabularyListItemProp): ReactElement => {
  const { article, word, document_image: documentImage } = document

  const title = <StyledTitle articleColor={getArticleColor(article)}>{article.value}</StyledTitle>
  const icon =
    documentImage.length > 0 ? (
      <StyledImage testID='image' source={{ uri: documentImage[0].image }} width={24} height={24} />
    ) : undefined

  const noop = () => undefined

  return (
    <ListItem
      title={title}
      description={word}
      onPress={setIsModalVisible ?? noop}
      icon={icon}
      rightChildren={
        <Speaker>
          <AudioPlayer document={document} disabled={false} />
        </Speaker>
      }
    />
  )
}

export default VocabularyListItem
