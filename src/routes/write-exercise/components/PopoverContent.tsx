import React, { ReactElement } from 'react'
import { InfoIcon } from '../../../../assets/images'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import labels from '../../../constants/labels.json'
import styled from 'styled-components/native'

const StyledContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${prop => prop.theme.colors.lunesBlack};
  width: ${wp('80%')}px;
  height: 60px;
  padding: 9px 8px 9px 8px;
  border-radius: 2px;
`
const StyledMessage = styled.Text`
  color: ${prop => prop.theme.colors.lunesWhite};
  font-size: ${wp('3.5%')}px;
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  width: ${wp('60%')}px;
  margin-left: 8px;
`

const PopoverContent = (): ReactElement => (
  <StyledContainer>
    <InfoIcon width={30} height={30} />
    <StyledMessage>{labels.exercises.write.feedback.articleMissing}</StyledMessage>
  </StyledContainer>
)

export default PopoverContent
