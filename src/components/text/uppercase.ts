import { css } from 'styled-components/native'

export const uppercase = css`
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
`

// Helper function which gets mocked in testing, so that tests can check for the passed button text
export const toButtonCase = (label: string): string => label.toUpperCase()
