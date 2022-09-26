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

const OPACITY_MIN = 0.2
const OPACITY_MAX = 1

const PressableContainer = styled.Pressable<{ isPressed: boolean }>`
  flex-direction: row;
  opacity: ${props => (props.isPressed ? OPACITY_MIN : OPACITY_MAX)};
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
