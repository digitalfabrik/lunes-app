import React from 'react'
import { InfoIcon } from '../../../../assets/images'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { COLORS } from '../../../constants/theme/colors'
import labels from '../../../constants/labels.json'
import styled from 'styled-components/native'

const StyledComponent = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.lunesBlack};
  width: ${wp('80%')};
  height: 60;
  padding-right: 8;
  padding-left: 8;
  padding-top: 9;
  padding-right: 9;
  border-radius: 2;
`
const StyledMessage = styled.Text` 
  color: ${COLORS.lunesWhite};
  font-size: ${wp('3.5%')};
  font-weight: normal;
  font-family: SourceSansPro-Regular;
  width: ${wp('60%')};
  margin-left: 8;
`

const PopoverContent = () => (
  <StyledComponent>
    <InfoIcon width={30} height={30} />
    <StyledMessage>{labels.exercises.write.feedback.articleMissing}</StyledMessage>
  </StyledComponent>
)

export default PopoverContent
