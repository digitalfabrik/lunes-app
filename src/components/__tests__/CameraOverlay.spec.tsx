import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { COLORS } from '../../constants/theme/colors'
import render from '../../testing/render'
import CameraOverlay from '../CameraOverlay'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('CameraOverlay', () => {
  const setVisible = jest.fn()

  it('should darken the close icon while pressed', async () => {
    const { findByTestId } = render(
      <CameraOverlay setVisible={setVisible}>
        <Text>Children</Text>
      </CameraOverlay>,
    )
    const closeIcon = await findByTestId('close-icon')
    expect(closeIcon.props.fill).toBe(COLORS.backgroundAccent)

    fireEvent(closeIcon, 'onPressIn')
    expect(closeIcon.props.fill).toBe(COLORS.containedButtonSelected)

    fireEvent(closeIcon, 'onPressOut')
    expect(closeIcon.props.fill).toBe(COLORS.backgroundAccent)
  })

  it('should close overlay on icon press', async () => {
    const { findByTestId } = render(
      <CameraOverlay setVisible={setVisible}>
        <Text>Children</Text>
      </CameraOverlay>,
    )
    const closeIcon = await findByTestId('close-icon')
    fireEvent.press(closeIcon)
    expect(setVisible).toHaveBeenCalledWith(false)
  })
})
