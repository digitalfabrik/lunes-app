import React, { ReactElement, ReactNode } from 'react'
import { HeaderButtons, OverflowMenu as RNOverflowMenu } from 'react-navigation-header-buttons'

import labels from '../constants/labels.json'

interface OverflowMenuProps {
  children: (ReactElement | ReactNode[]) & ReactNode
  icon: ReactElement
}

const OverflowMenu = ({ children, icon }: OverflowMenuProps): ReactElement => (
  <HeaderButtons>
    <RNOverflowMenu OverflowIcon={icon} accessibilityLabel={labels.general.header.overflowMenu}>
      {children}
    </RNOverflowMenu>
  </HeaderButtons>
)

export default OverflowMenu
