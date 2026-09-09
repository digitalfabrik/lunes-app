import React, { ReactElement, ReactNode } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { css } from 'styled-components/native'

import PressableOpacity from './PressableOpacity'

const Button = styled(PressableOpacity)<{ hasBorder: boolean; hasShadow: boolean }>`
  width: ${props => props.theme.spacings.lg};
  height: ${props => props.theme.spacings.lg};
  border-radius: ${props => props.theme.spacings.sm};
  align-items: center;
  justify-content: center;
  ${props =>
    props.hasBorder &&
    css`
      border: 1px solid ${props.theme.colors.backgroundHigh};
    `}
  ${props =>
    props.hasShadow &&
    css`
      shadow-color: ${props.theme.colors.shadow};
      shadow-radius: 5px;
      shadow-offset: 1px 1px;
      shadow-opacity: 0.5;
    `}
`

type CircularIconButtonProps = {
  children: ReactNode
  onPress: () => void
  hasBorder?: boolean
  hasShadow?: boolean
  accessibilityLabel?: string
  testID?: string
  style?: StyleProp<ViewStyle>
}

const CircularIconButton = ({
  children,
  onPress,
  hasBorder = false,
  hasShadow = false,
  accessibilityLabel,
  testID,
  style,
}: CircularIconButtonProps): ReactElement => (
  <Button
    onPress={onPress}
    hasBorder={hasBorder}
    hasShadow={hasShadow}
    accessibilityLabel={accessibilityLabel}
    testID={testID}
    style={style}
  >
    {children}
  </Button>
)

export default CircularIconButton
