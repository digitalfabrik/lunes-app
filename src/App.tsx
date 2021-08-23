import 'react-native-gesture-handler'
import { StatusBar } from 'react-native'
import Navigator from './navigation/Navigator'
import React, { ReactElement, useEffect } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const App = (): ReactElement => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 3000)
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar barStyle='light-content' />
      <Navigator />
    </SafeAreaProvider>
  )
}

export default App
