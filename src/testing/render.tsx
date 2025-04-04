import { render, RenderAPI, RenderResult } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import theme from '../constants/theme'
import { Storage, StorageContext } from '../services/Storage'

type InnerComponent = {
  children: ReactElement
}

const wrapWithTheme = ({ children }: InnerComponent): ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const renderWithTheme = (component: ReactElement): RenderAPI => render(component, { wrapper: wrapWithTheme })

export const renderWithStorage = (storage: Storage, ui: ReactElement): RenderResult =>
  render(<StorageContext.Provider value={storage}>{ui}</StorageContext.Provider>, { wrapper: wrapWithTheme })

export default renderWithTheme
