import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'
import { ThemeProvider } from 'styled-components/native'

import theme from './constants/theme'
import Navigator from './navigation/Navigator'
import { initSentry } from './services/sentry'

LogBox.ignoreLogs(['NativeEventEmitter'])

const App = (): ReactElement => {
  initSentry()

  LogBox.ignoreLogs(['EventEmitter.removeListener'])

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <OverflowMenuProvider>
          <Navigator />
        </OverflowMenuProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
