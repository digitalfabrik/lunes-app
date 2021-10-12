import React, { ReactElement } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { InfoIcon } from '../../../../assets/images'
import labels from '../../../constants/labels.json'

const StyledContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${prop => prop.theme.colors.lunesBlack};
  width: ${wp('80%')}px;
  height: 80px;
  padding: 9px 8px 9px 8px;
  border-radius: 2px;
`
const StyledMessage = styled.Text`
  color: ${prop => prop.theme.colors.lunesWhite};
  font-size: ${props => props.theme.fonts.smallFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  width: ${wp('60%')}px;
  margin-left: 8px;
`

const ArticleMissingPopoverContent = (): ReactElement => (
  <StyledContainer>
    <InfoIcon width={30} height={30} />
    <StyledMessage>{labels.exercises.write.feedback.articleMissing}</StyledMessage>
  </StyledContainer>
)

export default ArticleMissingPopoverContent
