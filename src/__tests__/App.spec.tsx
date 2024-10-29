import { act, render } from '@testing-library/react-native'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import App from '../App'

jest.mock('react-navigation-header-buttons', () => ({
  OverflowMenuProvider: ({ children }: { children: ReactNode }) => <View>{children}</View>,
}))
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

    expect(getByText('Navigator')).toBeTruthy()
  })
})
