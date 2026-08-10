import styled from 'styled-components/native'

export const Subheading = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  line-height: ${props => props.theme.fonts.lineHeightBody};
  font-family: ${props => props.theme.fonts.contentFontBold};
`

export const SubheadingText = styled(Subheading)`
  color: ${prop => prop.theme.colors.text};
`

export const SubheadingPrimary = styled(Subheading)`
  color: ${prop => prop.theme.colors.primary};
`
