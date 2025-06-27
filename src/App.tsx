import { NavigationContainer } from '@react-navigation/native'
import React, { ReactElement } from 'react'
import { LogBox } from 'react-native'
import 'react-native-gesture-handler'
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context'
import { HeaderButtonsProvider } from 'react-navigation-header-buttons'
import { ThemeProvider } from 'styled-components/native'

import theme from './constants/theme'
import Navigator from './navigation/Navigator'
import StorageProvider from './services/Storage'
import VolumeServiceProvider from './services/VolumeService'
import { initSentry } from './services/sentry'

LogBox.ignoreLogs(['NativeEventEmitter'])

const App = (): ReactElement => {
  initSentry()

  LogBox.ignoreLogs(['EventEmitter.removeListener'])

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StorageProvider>
          <VolumeServiceProvider>
            <NavigationContainer>
              <HeaderButtonsProvider stackType='native'>
                <Navigator />
              </HeaderButtonsProvider>
            </NavigationContainer>
          </VolumeServiceProvider>
        </StorageProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  )
}

export default App
