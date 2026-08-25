import styled from 'styled-components/native'

export const Content = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  line-height: ${props => props.theme.fonts.lineHeightBody};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

export const ContentSecondary = styled(Content)`
  color: ${props => props.theme.colors.textSecondary};
`
export const ContentText = styled(Content)`
  color: ${props => props.theme.colors.text};
`

export const ContentError = styled(Content)`
  color: ${props => props.theme.colors.incorrect};
`

export const ContentTextBold = styled(Content)`
  font-family: ${props => props.theme.fonts.contentFontBold};
`
