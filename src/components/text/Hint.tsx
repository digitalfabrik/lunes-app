import styled from 'styled-components/native'

export const Hint = styled.Text`
  font-size: ${props => props.theme.fonts.smallFontSize};
  line-height: ${props => props.theme.fonts.lineHeightCaption};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

export const HintText = styled(Hint)`
  color: ${props => props.theme.colors.text};
`

export const HintSecondary = styled(Hint)`
  color: ${props => props.theme.colors.textSecondary};
`
