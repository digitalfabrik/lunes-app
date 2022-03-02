import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from '../services/url'

const LinkText = styled.Text`
  text-decoration: underline;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${props => props.theme.colors.link};
`

interface LinkProps {
  url: string
  text: string
}

const Link = ({ url, text }: LinkProps): ReactElement => (
  <Pressable onPress={() => openExternalUrl(url)} accessibilityRole='link'>
    <LinkText>{text}</LinkText>
  </Pressable>
)

export default Link
