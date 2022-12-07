import React, { ReactElement, ReactNode } from 'react'
import { HeaderButtons, OverflowMenu as RNOverflowMenu } from 'react-navigation-header-buttons'

import { getLabels } from '../services/helpers'

type OverflowMenuProps = {
  children: (ReactElement | ReactNode[]) & ReactNode
  icon: ReactElement
}

const OverflowMenu = ({ children, icon }: OverflowMenuProps): ReactElement => (
  <HeaderButtons>
    <RNOverflowMenu OverflowIcon={icon} accessibilityLabel={getLabels().general.header.overflowMenu}>
      {children}
    </RNOverflowMenu>
  </HeaderButtons>
)

export default OverflowMenu
