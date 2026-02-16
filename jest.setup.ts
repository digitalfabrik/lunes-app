import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import '@testing-library/jest-native/extend-expect'
import { Component } from 'react'
// @ts-expect-error file is js
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
import 'react-native-gesture-handler/jestSetup'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

jest.mock('@notifee/react-native', () => require('@notifee/react-native/jest-mock'))
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)
jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('./src/hooks/useKeyboard', () => jest.fn(() => ({ isKeyboardVisible: false, keyboardHeight: 0 })))

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)
jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
  speak: jest.fn(),
}))
jest.mock('react-native-sound-player')

jest.mock('react-native-volume-manager', () => ({
  VolumeManager: {
    getVolume: jest.fn(async () => ({ volume: 1 })),
    addVolumeListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  useSilentSwitch: jest.fn(() => null),
}))

jest.mock('react-native/Libraries/Image/ImageBackground', () => {
  const { View } = require('react-native')
  return { __esModule: true, default: View }
})

jest.mock('react-native-image-zoom-viewer', () => {
  const React = require('react')
  const { View } = require('react-native')

  class ImageViewerMock extends Component<{
    imageUrls: { url: string }[]
    renderImage?: (item: { source: { uri: string } }) => React.ReactElement
    renderIndicator?: (currentIndex: number, allSize: number) => React.ReactElement
    backgroundColor?: string
  }> {
    private currentIndex = 0
    // eslint-disable-next-line react/no-unused-class-component-methods
    loadImage(index: number) {
      this.currentIndex = index
      this.forceUpdate()
    }
    // eslint-disable-next-line react/no-unused-class-component-methods
    goNext() {
      this.currentIndex += 1
      this.forceUpdate()
    }
    render() {
      const { imageUrls, renderImage, renderIndicator, backgroundColor } = this.props
      return React.createElement(
        View,
        { style: { flex: 1, backgroundColor } },
        imageUrls.map((url: { url: string }, i: number) =>
          i <= this.currentIndex
            ? React.createElement(View, { key: url.url }, renderImage?.({ source: { uri: url.url } }))
            : React.createElement(View, { key: url.url }),
        ),
        renderIndicator?.(this.currentIndex + 1, imageUrls.length),
      )
    }
  }
  return { __esModule: true, default: ImageViewerMock }
})

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
