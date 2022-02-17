import styled from 'styled-components/native'

export const NavigationTitle = styled.Text`
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  padding-left: ${props => props.theme.spacings.sm};
  padding-right: ${props => props.theme.spacings.xxs};
  flex: 1;
`
