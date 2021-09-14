import 'react-native-gesture-handler'
import { StatusBar } from 'react-native'
import Navigator from './navigation/Navigator'
import React, { ReactElement, useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'styled-components/native'
import theme from './constants/theme'

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
