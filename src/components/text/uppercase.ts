import { css } from 'styled-components/native'

export const uppercase = css`
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
`
