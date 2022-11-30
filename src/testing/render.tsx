import { render, RenderAPI } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import theme from '../constants/theme'

type InnerComponent = {
  children: ReactElement
}

const wrapWithTheme = ({ children }: InnerComponent): ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const renderWithTheme = (component: ReactElement): RenderAPI => render(component, { wrapper: wrapWithTheme })

export default renderWithTheme
