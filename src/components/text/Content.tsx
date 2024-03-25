import styled from 'styled-components/native'

export const Content = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`

export const ContentSecondary = styled(Content)`
  color: ${props => props.theme.colors.textSecondary};
`
export const ContentText = styled(Content)`
  color: ${props => props.theme.colors.text};
`

export const ContentBackground = styled(Content)`
  color: ${props => props.theme.colors.background};
`

export const ContentError = styled(Content)`
  color: ${props => props.theme.colors.incorrect};
`

export const ContentSecondaryLight = styled(ContentSecondary)`
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`

export const ContentTextLight = styled(Content)`
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`

export const ContentBackgroundLight = styled(ContentBackground)`
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`
export const ContentTextBold = styled(Content)`
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${prop => prop.theme.fonts.defaultFontSize};
`
