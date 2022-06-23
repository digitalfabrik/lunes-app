import { fireEvent } from '@testing-library/react-native'
import React from 'react'
// @ts-expect-error
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

import labels from '../../../../constants/labels.json'
import render from '../../../../testing/render'
import VersionPressable, { CLICKS_TO_THROW_SENTRY_ERROR } from '../VersionPressable'

jest.mock('react-native-device-info', () => mockRNDeviceInfo)

describe('VersionPressable', () => {
  const setVisible = jest.fn()
  it('should open modal on multiple clicks', () => {
    const { getByText } = render(<VersionPressable setVisible={setVisible} />)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const versionPressable = getByText(`${labels.settings.version}: ${mockRNDeviceInfo.getVersion()}`)
    for (let i = 0; i <= CLICKS_TO_THROW_SENTRY_ERROR; i += 1) {
      fireEvent.press(versionPressable)
    }
    expect(setVisible).toHaveBeenCalledTimes(1)
  })
})
