import React, { ReactElement, useEffect } from 'react'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'
import { ThemeProvider } from 'styled-components/native'

import theme from './constants/theme'
import Navigator from './navigation/Navigator'
import { initSentry } from './services/sentry'

LogBox.ignoreLogs(['NativeEventEmitter'])

const SPLASH_SCREEN_DURATION = 3000

const App = (): ReactElement => {
  initSentry()

  LogBox.ignoreLogs(['EventEmitter.removeListener'])

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, SPLASH_SCREEN_DURATION)
  }, [])

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
