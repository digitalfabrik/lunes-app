import React from 'react'
import Popover, { PopoverPlacement } from 'react-native-popover-view'
import { IPopoverProps } from '../interfaces'
import { StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors'

export const styles = StyleSheet.create({
  arrow: {
    backgroundColor: COLORS.lunesBlack
  },
  overlay: {
    backgroundColor: 'transparent'
  }
})
const AlertPopover = React.forwardRef(({ children, isVisible, setIsPopoverVisible }: IPopoverProps, ref) => (
  <Popover
    isVisible={isVisible}
    onRequestClose={() => setIsPopoverVisible(false)}
    from={ref}
    placement={PopoverPlacement.TOP}
    arrowStyle={styles.arrow}
    arrowShift={-0.85}
    verticalOffset={-10}
    backgroundStyle={styles.overlay}>
    {children}
  </Popover>
))

export default AlertPopover
