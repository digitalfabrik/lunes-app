import styled from 'styled-components/native'

import { uppercase } from './text/uppercase'

export const NavigationTitle = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  ${uppercase};
  padding-left: ${props => props.theme.spacings.sm};
  padding-right: ${props => props.theme.spacings.xxs};
  flex: 1;
`
