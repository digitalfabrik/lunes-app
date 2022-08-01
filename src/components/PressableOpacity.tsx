import React, { ReactElement, ReactNode, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

interface Props {
  children: ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const PressableContainer = styled.Pressable<{ isPressed: boolean }>`
  flex-direction: row;
  background-color: ${props => (props.isPressed ? props.theme.colors.background : 'transparent')}
  opacity: ${props => (props.isPressed ? 0.2 : 1)}
`

const PressableOpacity = ({ children, onPress, style, testID }: Props): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)

  return (
    <PressableContainer
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      isPressed={isPressed}
      accessibilityRole='button'
      style={style}
      testID={testID}>
      {children}
    </PressableContainer>
  )
}

export default PressableOpacity
