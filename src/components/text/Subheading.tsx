import styled from 'styled-components/native'

export const Subheading = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`

export const SubheadingText = styled(Subheading)`
  color: ${prop => prop.theme.colors.text};
`

export const SubheadingPrimary = styled(Subheading)`
  color: ${prop => prop.theme.colors.primary};
`

export const SubheadingSecondary = styled(Subheading)`
  color: ${prop => prop.theme.colors.textSecondary};
`
