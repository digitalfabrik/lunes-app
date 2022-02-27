import React, { ReactElement } from 'react'
import { Platform, TouchableHighlight, TouchableHighlightProps, TouchableNativeFeedback } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from '../services/url'

const LinkText = styled.Text`
  text-decoration: underline;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: blue;
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
  <Touchable onPress={() => openExternalUrl(url)} accessibilityRole='link' underlayColor='transparent'>
    <LinkText>{text}</LinkText>
  </Touchable>
)

export default Link
