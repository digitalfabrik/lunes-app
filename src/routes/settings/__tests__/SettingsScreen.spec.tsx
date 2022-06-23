import React from 'react'
// @ts-expect-error
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

import labels from '../../../constants/labels.json'
import render from '../../../testing/render'
import SettingsScreen from '../SettingsScreen'

jest.mock('react-native-device-info', () => mockRNDeviceInfo)

describe('SettingsScreen', () => {
  it('should render all elements', () => {
    const { getByText } = render(<SettingsScreen />)
    expect(getByText(labels.settings.settings)).toBeDefined()
    expect(getByText(labels.settings.appStability)).toBeDefined()
    expect(getByText(labels.settings.appStabilityExplanation)).toBeDefined()
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    expect(getByText(`${labels.settings.version}: ${mockRNDeviceInfo.getVersion()}`)).toBeDefined()
  })
})
