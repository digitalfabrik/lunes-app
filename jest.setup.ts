import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import '@testing-library/jest-native/extend-expect'
import { Animated } from 'react-native'
// @ts-expect-error file is js
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
import 'react-native-gesture-handler/jestSetup'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

jest.mock('@notifee/react-native', () => require('@notifee/react-native/jest-mock'))
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('react-native-device-info', () => mockRNDeviceInfo)
jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated/mock')

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => undefined

  return Reanimated
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('react-native-tts')
jest.mock('react-native-sound-player')

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
}))
jest.mock('@react-navigation/elements', () => ({
  useHeaderHeight: jest.fn().mockImplementation(() => 200),
}))
beforeEach(() => {
  jest.clearAllMocks()
  mockAsyncStorage.clear()
})

// @ts-expect-error https://github.com/software-mansion/react-native-reanimated/issues/2766#issuecomment-1569765201
Animated.timing = () => ({
  start: () => jest.fn(),
})
