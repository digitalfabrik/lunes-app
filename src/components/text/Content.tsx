import styled from 'styled-components/native'

export const Content = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
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

export const ContentTextLight = styled(ContentText)`
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`

export const ContentBackgroundLight = styled(ContentBackground)`
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`
