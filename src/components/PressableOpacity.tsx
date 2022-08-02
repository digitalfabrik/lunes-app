import React, { ReactElement, ReactNode, useState } from 'react'
import { AccessibilityRole, StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

interface Props {
  children: ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
  accessibilityRole?: AccessibilityRole
  disabled?: boolean
}

const OPACITY_MIN = 0.2
const OPACITY_MAX = 1

const PressableContainer = styled.Pressable<{ isPressed: boolean }>`
  flex-direction: row;
  background-color: ${props => (props.isPressed ? props.theme.colors.background : 'transparent')}
  opacity: ${props => (props.isPressed ? OPACITY_MIN : OPACITY_MAX)}
`

const PressableOpacity = ({
  children,
  onPress,
  style,
  testID,
  accessibilityRole,
  disabled = false,
}: Props): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <PressableContainer
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      isPressed={isPressed}
      // @ts-expect-error can not be passed to Pressable even type is correct
      accessibilityRole={accessibilityRole}
      style={style}
      testID={testID}>
      {children}
    </PressableContainer>
  )
}

export default PressableOpacity
