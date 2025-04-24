import { render, RenderAPI, RenderResult } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import { ThemeProvider } from 'styled-components/native'

import theme from '../constants/theme'
import { StorageCache, StorageCacheContext } from '../services/Storage'

type InnerComponent = {
  children: ReactElement
}

const wrapWithTheme = ({ children }: InnerComponent): ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const renderWithTheme = (component: ReactElement): RenderAPI => render(component, { wrapper: wrapWithTheme })

export const renderWithStorageCache = (storageCache: StorageCache, ui: ReactElement): RenderResult =>
  render(<StorageCacheContext.Provider value={storageCache}>{ui}</StorageCacheContext.Provider>, {
    wrapper: wrapWithTheme,
  })

export default renderWithTheme
