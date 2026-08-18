import styled from 'styled-components/native'

export const Heading = styled.Text<{ centered?: boolean }>`
  font-size: ${props => props.theme.fonts.headingFontSize};
  line-height: ${props => props.theme.fonts.lineHeightHeading};
  font-family: ${props => props.theme.fonts.contentFontBold};
  ${props => (props.centered ? 'align-self: center;' : '')};
`

export const HeadingText = styled(Heading)`
  color: ${props => props.theme.colors.text};
`

export const HeadingBackground = styled(Heading)`
  color: ${props => props.theme.colors.background};
`

export const VocabularyWord = HeadingText
