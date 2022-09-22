import styled from 'styled-components/native'

export const Hint = styled.Text`
  font-size: ${props => props.theme.fonts.smallFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
`

export const HintText = styled(Hint)`
  color: ${props => props.theme.colors.text};
`
