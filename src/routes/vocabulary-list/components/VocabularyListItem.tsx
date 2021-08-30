import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { COLORS } from '../../../constants/colors'
import { getArticleColor } from '../../../services/helpers'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AudioPlayer from '../../../components/AudioPlayer'
import { DocumentType } from '../../../constants/endpoints'
import styled from 'styled-components/native'

const Wrapper = styled.View` 
  padding-right: ${wp('5%')}; 
  padding-left: ${wp('5%')}; 
`
const Container = styled.View` 
  padding-top: 17;
  padding-bottom: 17;
  padding-right: 16;
  padding-left: 16;
  margin-bottom: 8;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${COLORS.white};
  border-color: ${COLORS.lunesBlackUltralight};
  border-width: 1;
  border-style: solid;
  border-radius: 2;
`
const StyledItem = styled.View` 
  flex-direction: row;
  align-items: center;
`
const StyledImage = styled.Image` 
  margin-right: 15;
  width: ${wp('15%')};
  height: ${wp('15%')};
  border-radius: 50;
`
const StyledTitle = styled.Text` 
  font-size: ${wp('3.5%')};
  font-weight: normal;
  border-radius: 10;
  margin-bottom: 6;
  color: ${COLORS.lunesGreyDark};
  font-family: 'SourceSansPro-Regular';
  align-self: flex-start;
  width: ${wp('10%')};
  overflow: hidden;
  height: ${wp('5%')};
  text-align: center;

`
const Description = styled.Text` 
  font-size: ${wp('4%')};
  font-weight: normal;
  color: ${COLORS.lunesGreyMedium};
  font-family: 'SourceSansPro-Regular';
  margin-left: 8;
`
const Speaker = styled.View` 
  padding-right: 40;
  padding-top: 17;
`

export interface VocabularyListItemPropType {
  document: DocumentType
}

const VocabularyListItem = ({ document }: VocabularyListItemPropType): ReactElement => {
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
            <Description testID='word'>
              {word}
            </Description>
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