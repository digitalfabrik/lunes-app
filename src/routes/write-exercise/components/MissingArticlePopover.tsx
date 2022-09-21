import React, { forwardRef } from 'react'
import { StyleSheet } from 'react-native'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { InfoCircleIcon } from '../../../../assets/images'
import { ContentBackgroundLight } from '../../../components/text/Content'
import { COLORS } from '../../../constants/theme/colors'
import { getLabels } from '../../../services/helpers'

export const styles = StyleSheet.create({
  popover: {
    backgroundColor: COLORS.primary,
  },
  overlay: {
    backgroundColor: 'transparent',
  },
})

const StyledContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${wp('80%')}px;
  height: ${hp('7.5%')}px;
  padding: ${props => props.theme.spacings.xs};
  border-radius: 2px;
`
const StyledMessage = styled(ContentBackgroundLight)`
  font-size: ${props => props.theme.fonts.smallFontSize};
  width: ${wp('60%')}px;
  margin-left: ${props => props.theme.spacings.xs};
`

export interface IPopoverProps {
  setIsPopoverVisible: (isVisible: boolean) => void
  isVisible: boolean
}

const MissingArticlePopover = forwardRef(({ isVisible, setIsPopoverVisible }: IPopoverProps, ref) => (
  <Popover
    // @ts-expect-error, used for testing purposes
    testID='popover'
    isVisible={isVisible}
    onRequestClose={() => setIsPopoverVisible(false)}
    from={ref}
    placement={PopoverPlacement.TOP}
    popoverStyle={styles.popover}
    arrowShift={-0.85}
    verticalOffset={-10}
    backgroundStyle={styles.overlay}>
    <StyledContainer>
      <InfoCircleIcon width={hp('3%')} height={hp('3%')} />
      <StyledMessage>{getLabels().exercises.write.feedback.articleMissing}</StyledMessage>
    </StyledContainer>
  </Popover>
))

export default MissingArticlePopover
