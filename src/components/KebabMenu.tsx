import React, { ReactElement } from 'react'
import { HeaderButtons, OverflowMenu } from 'react-navigation-header-buttons'

interface KebabMenuProps {
  children: ReactElement
  icon: ReactElement
}

const KebabMenu: React.FC<KebabMenuProps> = ({ children, icon }: KebabMenuProps): ReactElement => (
  <HeaderButtons>
    <OverflowMenu OverflowIcon={icon}>{children}</OverflowMenu>
  </HeaderButtons>
)

export default KebabMenu
