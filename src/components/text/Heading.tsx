import styled from 'styled-components/native'

export const Heading = styled.Text`
  font-size: ${props => props.theme.fonts.headingFontSize};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.headingFontSize};
  text-align: center;
`

export const HeadingText = styled(Heading)`
  color: ${props => props.theme.colors.text};
`
