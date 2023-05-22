import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { HeadingBackground } from './text/Heading'

const OverlayMenuPressable = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
`

const OverlayMenuText = styled(HeadingBackground)<{ isSubItem: boolean }>`
  padding: ${props => props.theme.spacings.sm};
  font-family: ${props => (props.isSubItem ? props.theme.fonts.contentFontRegular : props.theme.fonts.contentFontBold)};
`

type OverlayMenuItemProps = {
  isSubItem?: boolean
  title: string
  onPress: () => void
}

const OverlayMenuItem = ({ title, onPress, isSubItem }: OverlayMenuItemProps): ReactElement => (
  <OverlayMenuPressable onPress={onPress}>
    <OverlayMenuText isSubItem={!!isSubItem}>{title}</OverlayMenuText>
  </OverlayMenuPressable>
)

export default OverlayMenuItem
