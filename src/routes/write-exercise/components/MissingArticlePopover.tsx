import React from 'react'
import { StyleSheet } from 'react-native'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { InfoIcon } from '../../../../assets/images'
import labels from '../../../constants/labels.json'
import { COLORS } from '../../../constants/theme/colors'

export const styles = StyleSheet.create({
  arrow: {
    backgroundColor: COLORS.lunesBlack
  },
  overlay: {
    backgroundColor: 'transparent'
  }
})

const StyledContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${prop => prop.theme.colors.lunesBlack};
  width: ${wp('80%')}px;
  height: 50px;
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

export interface IPopoverProps {
  setIsPopoverVisible: (param: boolean) => void
  isVisible: boolean
}

const MissingArticlePopover = React.forwardRef(({ isVisible, setIsPopoverVisible }: IPopoverProps, ref) => (
  <Popover
    isVisible={isVisible}
    onRequestClose={() => setIsPopoverVisible(false)}
    from={ref}
    placement={PopoverPlacement.TOP}
    arrowStyle={styles.arrow}
    arrowShift={-0.85}
    verticalOffset={-10}
    backgroundStyle={styles.overlay}>
    <StyledContainer>
      <InfoIcon width={30} height={30} />
      <StyledMessage>{labels.exercises.write.feedback.articleMissing}</StyledMessage>
    </StyledContainer>
  </Popover>
))

export default MissingArticlePopover
