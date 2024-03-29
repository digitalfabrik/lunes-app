import { act, render } from '@testing-library/react-native'
import React, { ReactNode } from 'react'
import { View } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import App from '../App'

jest.mock('react-navigation-header-buttons', () => ({
  OverflowMenuProvider: ({ children }: { children: ReactNode }) => <View>{children}</View>,
}))
jest.mock('react-native-splash-screen', () => ({ hide: jest.fn() }))
jest.mock('../navigation/Navigator', () => {
  const Text = require('react-native').Text
  return () => <Text>Navigator</Text>
})
jest.useFakeTimers()

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />)

    // wait for splash screen to disappear
    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(SplashScreen.hide).toHaveBeenCalled()
    expect(getByText('Navigator')).toBeTruthy()
  })
})
