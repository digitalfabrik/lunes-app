import React, { ReactElement } from 'react'
import { Pressable } from 'react-native'
import styled from 'styled-components/native'

import { openExternalUrl } from '../services/url'
import { ContentTextLight } from './text/Content'

const LinkText = styled(ContentTextLight)`
  text-decoration: underline;
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
