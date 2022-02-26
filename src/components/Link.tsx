import React, { ReactElement } from 'react'
import { Linking, Platform, TouchableHighlight, TouchableHighlightProps, TouchableNativeFeedback } from 'react-native'
import styled from 'styled-components/native'

const LinkText = styled.Text`
  text-decoration: underline;
`

const Touchable = Platform.select<React.ComponentType<TouchableHighlightProps>>({
  android: TouchableNativeFeedback,
  ios: TouchableHighlight,
  default: TouchableHighlight
})

interface LinkProps {
  url: string
  text: string
}

const Link = ({ url, text }: LinkProps): ReactElement => (
  <Touchable onPress={() => Linking.openURL(url)} accessibilityRole='link' underlayColor='transparent'>
    <LinkText>{text}</LinkText>
  </Touchable>
)

export default Link
