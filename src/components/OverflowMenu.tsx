import React, { ReactElement } from 'react'
import { HeaderButtons, OverflowMenu as OverflowMenuRN } from 'react-navigation-header-buttons'

import labels from '../constants/labels.json'

interface OverflowMenuProps {
  children: ReactElement
  icon: ReactElement
}

const OverflowMenu = ({ children, icon }: OverflowMenuProps): ReactElement => (
  <HeaderButtons>
    <OverflowMenuRN OverflowIcon={icon} accessibilityLabel={labels.general.header.overflowMenu}>
      {children}
    </OverflowMenuRN>
  </HeaderButtons>
)

export default OverflowMenu
