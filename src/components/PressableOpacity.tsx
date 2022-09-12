import React, { ReactElement, ReactNode, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

interface Props {
  children: ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
  disabled?: boolean
}

const PressableContainer = styled.Pressable<{ isPressed: boolean }>`
  flex-direction: row;
  opacity: ${props => (props.isPressed ? props.theme.styles.pressOpacity.min : props.theme.styles.pressOpacity.max)};
`

const PressableOpacity = ({ children, onPress, style, testID, disabled = false }: Props): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <PressableContainer
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      isPressed={isPressed}
      style={style}
      testID={testID}>
      {children}
    </PressableContainer>
  )
}

export default PressableOpacity
