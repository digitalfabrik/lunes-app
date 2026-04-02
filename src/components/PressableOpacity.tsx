import React, { ReactElement, ReactNode, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

type PressableOpacityProps = {
  children: ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
  disabled?: boolean
  accessibilityLabel?: string
}

const PressableContainer = styled.Pressable<{ isPressed: boolean }>`
  flex-direction: row;
  opacity: ${props => (props.isPressed ? props.theme.styles.pressOpacity.min : props.theme.styles.pressOpacity.max)};
`

const PressableOpacity = ({
  children,
  onPress,
  style,
  testID,
  disabled = false,
  accessibilityLabel,
}: PressableOpacityProps): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <PressableContainer
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      isPressed={isPressed}
      style={style}
      testID={testID}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </PressableContainer>
  )
}

export default PressableOpacity
