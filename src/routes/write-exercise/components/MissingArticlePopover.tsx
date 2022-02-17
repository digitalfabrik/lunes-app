import React from 'react'
import { StyleSheet } from 'react-native'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { InfoCircleIcon } from '../../../../assets/images'
import labels from '../../../constants/labels.json'
import { COLORS } from '../../../constants/theme/colors'

export const styles = StyleSheet.create({
  arrow: {
    backgroundColor: COLORS.primary
  },
  overlay: {
    backgroundColor: 'transparent'
  }
})

const StyledContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${prop => prop.theme.colors.primary};
  width: ${wp('80%')}px;
  height: ${wp('15%')}px;
  padding: ${props => props.theme.spacings.xs};
  border-radius: 2px;
`
const StyledMessage = styled.Text`
  color: ${prop => prop.theme.colors.background};
  font-size: ${props => props.theme.fonts.smallFontSize};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  width: ${wp('60%')}px;
  margin-left: ${props => props.theme.spacings.xs};
`

export interface IPopoverProps {
  setIsPopoverVisible: (isVisible: boolean) => void
  isVisible: boolean
}

const MissingArticlePopover = React.forwardRef(({ isVisible, setIsPopoverVisible }: IPopoverProps, ref) => (
  <Popover
    // @ts-expect-error, used for testing purposes
    testID='popover'
    isVisible={isVisible}
    onRequestClose={() => setIsPopoverVisible(false)}
    from={ref}
    placement={PopoverPlacement.TOP}
    arrowStyle={styles.arrow}
    arrowShift={-0.85}
    verticalOffset={-10}
    backgroundStyle={styles.overlay}>
    <StyledContainer>
      <InfoCircleIcon width={wp('6%')} height={wp('6%')} />
      <StyledMessage>{labels.exercises.write.feedback.articleMissing}</StyledMessage>
    </StyledContainer>
  </Popover>
))

export default MissingArticlePopover
