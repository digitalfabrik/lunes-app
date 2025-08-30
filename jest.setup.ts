import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import '@testing-library/jest-native/extend-expect'
// @ts-expect-error file is js
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
import 'react-native-gesture-handler/jestSetup'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

jest.mock('@notifee/react-native', () => require('@notifee/react-native/jest-mock'))
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  speak: jest.fn(),
}))
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
