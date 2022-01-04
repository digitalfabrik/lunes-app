import React, { ReactElement, useEffect } from 'react'
import { LogBox, StatusBar } from 'react-native'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import { ThemeProvider } from 'styled-components/native'

import theme from './constants/theme'
import Navigator from './navigation/Navigator'

LogBox.ignoreLogs(['NativeEventEmitter'])

const App = (): ReactElement => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 3000)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <StatusBar barStyle='light-content' />
        <Navigator />
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
