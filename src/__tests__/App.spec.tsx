import { render, waitFor } from '@testing-library/react-native'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

import App from '../App'

jest.mock('react-navigation-header-buttons', () => ({
  HeaderButtonsProvider: ({ children }: { children: ReactNode }) => <View>{children}</View>,
}))
jest.mock('../navigation/Navigator', () => {
  const Text = require('react-native').Text
  return () => <Text>Navigator</Text>
})
jest.useFakeTimers()

describe('App', () => {
  it('renders correctly', async () => {
    const { getByText } = render(<App />)

    await waitFor(() => {
      expect(getByText('Navigator')).toBeTruthy()
    })
  })
})
