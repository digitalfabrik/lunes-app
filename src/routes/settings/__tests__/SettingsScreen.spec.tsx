import React from 'react'

import labels from '../../../constants/labels.json'
import render from '../../../testing/render'
import SettingsScreen from '../SettingsScreen'

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '2022.6.0'),
}))

jest.mock('react-native/Libraries/Components/Switch/Switch', () => {
  const mockComponent = require('react-native/jest/mockComponent')
  return {
    default: mockComponent('react-native/Libraries/Components/Switch/Switch'),
  }
})

describe('SettingsScreen', () => {
  it('should render all elements', () => {
    const { getByText } = render(<SettingsScreen />)
    expect(getByText(labels.settings.settings)).toBeDefined()
    expect(getByText(labels.settings.appStability)).toBeDefined()
    expect(getByText(labels.settings.appStabilityExplanation)).toBeDefined()
    expect(getByText(`${labels.settings.version}: 2022.6.0`)).toBeDefined()
  })
})
