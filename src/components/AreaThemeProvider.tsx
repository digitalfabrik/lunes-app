import React, { ReactElement, ReactNode } from 'react'
import { ThemeProvider } from 'styled-components/native'

import useAreaTheme from '../hooks/useAreaTheme'
import useContentArea from '../hooks/useContentArea'

type AreaThemeProviderProps = {
  token: string | undefined
  children: ReactNode
}

const AreaThemeProvider = ({ token, children }: AreaThemeProviderProps): ReactElement => {
  const contentArea = useContentArea(token)
  return <ThemeProvider theme={useAreaTheme(contentArea)}>{children}</ThemeProvider>
}

export default AreaThemeProvider
