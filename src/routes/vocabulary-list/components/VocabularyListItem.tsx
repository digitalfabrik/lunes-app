import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { getArticleColor } from '../../../services/helpers'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AudioPlayer from '../../../components/AudioPlayer'
import { DocumentType } from '../../../constants/endpoints'
import styled from 'styled-components/native'

const Wrapper = styled.Pressable`
  padding-right: ${wp('5%')};
  padding-left: ${wp('5%')};
`
const Container = styled.View`
  padding: 17px 16px 17px 16px;
  margin-bottom: 8px;
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
  margin-right: 15px;
  width: ${wp('15%')}px;
  height: ${wp('15%')}px;
  border-radius: 50px;
`
const StyledTitle = styled.Text`
  font-size: ${wp('3.5%')}px;
  font-weight: normal;
  border-radius: 10px;
  margin-bottom: 6px;
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  align-self: flex-start;
  width: ${wp('10%')}px;
  overflow: hidden;
  height: ${wp('5%')}px;
  text-align: center;
  line-height: 18px;
`
const Description = styled.Text`
  font-size: ${wp('4%')}px;
  font-weight: normal;
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  margin-left: 8px;
`
const Speaker = styled.View`
  padding-right: 40px;
  padding-top: 17px;
`

export interface VocabularyListItemPropType {
  document: DocumentType
  setIsModalVisible?: () => void
}

const VocabularyListItem = ({ document, setIsModalVisible }: VocabularyListItemPropType): ReactElement => {
  const { article, word } = document

  return (
    <Wrapper onPress={setIsModalVisible ?? (() => {
    })}>
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
            <StyledTitle testID='article' style={[{ backgroundColor: getArticleColor(article) }]}>
              {article.value}
            </StyledTitle>
            <Description testID='word'>{word}</Description>
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
