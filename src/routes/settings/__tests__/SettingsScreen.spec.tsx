import React from 'react'

import { getLabels } from '../../../services/helpers'
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

jest.mock('../components/DebugModal', () => {
  const Text = require('react-native').Text
  return () => <Text>DebugModal</Text>
})

describe('SettingsScreen', () => {
  it('should render all elements', () => {
    const { getByText } = render(<SettingsScreen />)
    expect(getByText(getLabels().settings.settings)).toBeDefined()
    expect(getByText(getLabels().settings.appStability)).toBeDefined()
    expect(getByText(getLabels().settings.appStabilityExplanation)).toBeDefined()
    expect(getByText(`${getLabels().settings.version}: 2022.6.0`)).toBeDefined()
  })
})
