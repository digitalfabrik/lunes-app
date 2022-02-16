import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import AudioPlayer from '../../../components/AudioPlayer'
import { Document } from '../../../constants/endpoints'
import { getArticleColor } from '../../../services/helpers'

const Wrapper = styled.Pressable`
  padding-right: 5%;
  padding-left: 5%;
`
const Container = styled.View`
  padding: 17px 16px;
  margin-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${props => props.theme.colors.backgroundAccent};
  border-color: ${props => props.theme.colors.disabled};
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
`
const StyledItem = styled.View`
  flex-direction: row;
  align-items: center;
`
const StyledImage = styled.Image`
  margin-right: 15px;
  width: ${wp('15%')}px;
  height: ${wp('15%')}px;
  border-radius: 50px;
`
const StyledTitle = styled.Text<{ articleColor: string }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  border-radius: 10px;
  margin-bottom: 6px;
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.articleColor};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: flex-start;
  width: ${wp('10%')}px;
  overflow: hidden;
  height: ${wp('5%')}px;
  text-align: center;
`
const Description = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  margin-left: 8px;
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
  const { article, word } = document

  return (
    <Wrapper onPress={setIsModalVisible}>
      <Container>
        <StyledItem>
          {document.document_image.length > 0 && (
            <StyledImage
              testID='image'
              source={{
                uri: document.document_image[0].image
              }}
              width={24}
              height={24}
            />
          )}
          <View>
            <StyledTitle articleColor={getArticleColor(article)}>{article.value}</StyledTitle>
            <Description>{word}</Description>
          </View>
        </StyledItem>
        <Speaker>
          <AudioPlayer document={document} disabled={false} />
        </Speaker>
      </Container>
    </Wrapper>
  )
}

export default VocabularyListItem
