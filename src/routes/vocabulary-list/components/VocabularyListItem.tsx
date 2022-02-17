import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import AudioPlayer from '../../../components/AudioPlayer'
import { Document } from '../../../constants/endpoints'
import { getArticleColor } from '../../../services/helpers'

const Wrapper = styled.Pressable`
  padding-right: ${props => props.theme.spacings.md};
  padding-left: ${props => props.theme.spacings.md};
`
const Container = styled.View`
  padding: ${props => `${props.theme.spacings.sm}`};
  margin-bottom: ${props => props.theme.spacings.xs};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  border-color: ${props => props.theme.colors.lunesBlackUltralight};
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
`
const StyledItem = styled.View`
  flex-direction: row;
  align-items: center;
`
const StyledImage = styled.Image`
  margin-right: ${props => props.theme.spacings.sm};
  width: ${wp('15%')}px;
  height: ${wp('15%')}px;
  border-radius: ${props => props.theme.spacings.xxl};
`
const StyledTitle = styled.Text<{ articleColor: string }>`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  border-radius: ${props => props.theme.spacings.xs};
  margin-bottom: ${props => props.theme.spacings.xxs};
  color: ${props => props.theme.colors.lunesGreyDark};
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
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  margin-left: ${props => props.theme.spacings.xs};
`
const Speaker = styled.View`
  padding-right: ${props => props.theme.spacings.xl};
  padding-top: ${props => props.theme.spacings.sm};
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
              width={wp('8%')}
              height={hp('8%')}
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
