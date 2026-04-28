import { render, waitFor } from '@testing-library/react-native'
import React from 'react'

import App from '../App'

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
