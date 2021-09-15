import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { COLORS } from '../../../constants/theme/colors'
import { getArticleColor } from '../../../services/helpers'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AudioPlayer from '../../../components/AudioPlayer'
import { DocumentType } from '../../../constants/endpoints'
import styled from 'styled-components/native'

const Wrapper = styled.View`
  padding-right: 5%;
  padding-left: 5%;
`
const Container = styled.View`
  padding-top: 17px;
  padding-bottom: 17px;
  padding-right: 16px;
  padding-left: 16px;
  margin-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${COLORS.white};
  border-color: ${COLORS.lunesBlackUltralight};
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
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-Regular';
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
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
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
    <Wrapper>
      <Container>
        <StyledItem>
          {document.document_image.length > 0 && (
            <StyledImage
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
