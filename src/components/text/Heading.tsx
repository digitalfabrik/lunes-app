import styled from 'styled-components/native'

export const Heading = styled.Text`
  font-size: ${props => props.theme.fonts.headingFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`

export const HeadingText = styled(Heading)`
  color: ${props => props.theme.colors.text};
`

export const HeadingBackground = styled(Heading)`
  color: ${props => props.theme.colors.background};
`
