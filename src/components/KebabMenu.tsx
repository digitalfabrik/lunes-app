import React, { ReactElement } from 'react'
import { HeaderButtons, OverflowMenu } from 'react-navigation-header-buttons'

import labels from '../constants/labels.json'

interface KebabMenuProps {
  children: ReactElement
  icon: ReactElement
}

const KebabMenu: React.FC<KebabMenuProps> = ({ children, icon }: KebabMenuProps): ReactElement => (
  <HeaderButtons>
    <OverflowMenu OverflowIcon={icon} accessibilityLabel={labels.general.header.overflowMenu}>
      {children}
    </OverflowMenu>
  </HeaderButtons>
)

export default KebabMenu
