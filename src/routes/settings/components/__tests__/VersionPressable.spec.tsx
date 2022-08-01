import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import render from '../../../../testing/render'
import VersionPressable, { CLICK_THRESHOLD } from '../VersionPressable'

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '2022.6.0'),
}))

describe('VersionPressable', () => {
  const onClickThresholdReached = jest.fn()
  it('should open modal on multiple clicks', () => {
    const { getByText } = render(<VersionPressable onClickThresholdReached={onClickThresholdReached} />)
    const versionPressable = getByText(`${labels.settings.version}: 2022.6.0`)
    for (let i = 0; i <= CLICK_THRESHOLD; i += 1) {
      fireEvent.press(versionPressable)
    }
    expect(onClickThresholdReached).toHaveBeenCalledTimes(1)
  })
})
