import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import theme from '../constants/theme'

interface InnerComponent {
  children: ReactElement
}

const wrapWithTheme = ({ children }: InnerComponent): ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export default wrapWithTheme
