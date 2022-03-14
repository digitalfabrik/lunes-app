import { render, RenderAPI, RenderOptions } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import theme from '../constants/theme'

interface InnerComponent {
  children: ReactElement
}

const wrapWithTheme = ({ children }: InnerComponent): ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const renderWithTheme = (component: ReactElement, options?: RenderOptions): RenderAPI =>
  render(component, { wrapper: wrapWithTheme, ...options })

export default renderWithTheme
