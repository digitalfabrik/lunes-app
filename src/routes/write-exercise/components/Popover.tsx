import React, { ReactElement } from 'react'
import { StyleSheet } from 'react-native'
import Popover, { PopoverPlacement } from 'react-native-popover-view'

import { COLORS } from '../../../constants/theme/colors'

export const styles = StyleSheet.create({
  arrow: {
    backgroundColor: COLORS.lunesBlack
  },
  overlay: {
    backgroundColor: 'transparent'
  }
})

export interface IPopoverProps {
  setIsPopoverVisible: (param: boolean) => void
  isVisible: boolean
  children: ReactElement
}

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
