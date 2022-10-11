import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import render from '../../testing/render'
import CameraOverlay from '../CameraOverlay'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('CameraOverlay', () => {
  const setVisible = jest.fn()

  it('should show close header with correct icon', async () => {
    const { getByTestId, queryByTestId, findByTestId } = render(
      <CameraOverlay setVisible={setVisible}>
        <Text>Children</Text>
      </CameraOverlay>
    )
    const closeIcon = await findByTestId('close-circle-icon-white')
    expect(closeIcon).toBeDefined()
    fireEvent(closeIcon, 'onPressIn')
    expect(getByTestId('close-circle-icon-blue')).toBeDefined()
    expect(queryByTestId('close-circle-icon-white')).toBeNull()
  })

  it('should close overlay on icon press', async () => {
    const { findByTestId } = render(
      <CameraOverlay setVisible={setVisible}>
        <Text>Children</Text>
      </CameraOverlay>
    )
    const closeIcon = await findByTestId('close-circle-icon-white')
    expect(closeIcon).toBeDefined()
    fireEvent.press(closeIcon)
    expect(setVisible).toHaveBeenCalledWith(false)
  })
})
