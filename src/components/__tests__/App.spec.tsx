import { act, render } from '@testing-library/react-native'
import React from 'react'
import 'react-native'
import SplashScreen from 'react-native-splash-screen'

import App from '../../App'

jest.mock('react-native-splash-screen', () => ({ hide: jest.fn() }))
jest.mock('../../navigation/Navigator', () => {
  const Text = require('react-native').Text
  return () => <Text>Navigator</Text>
})
jest.useFakeTimers('modern')

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />)

    // wait for splash screen to disappear
    await act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(SplashScreen.hide).toHaveBeenCalled()
    expect(getByText('Navigator')).toBeTruthy()
  })
})
