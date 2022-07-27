import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import { productionCMS, testCMS } from '../../../../services/axios'
import render from '../../../../testing/render'
import DebugModal from '../DebugModal'

describe('DebugModal', () => {
  it('should show buttons only for correct text input', async () => {
    const { queryByText, getByPlaceholderText } = render(<DebugModal visible onClose={jest.fn()} />)
    expect(queryByText(labels.settings.debugModal.sentry)).toBeNull()
    const textField = getByPlaceholderText('Development Code')
    await act(async () => {
      fireEvent.changeText(textField, 'wirschaffendas')
    })
    expect(queryByText(labels.settings.debugModal.sentry)).not.toBeNull()
  })

  it('should show and switch cms url', async () => {
    const { getByText, getByPlaceholderText } = render(<DebugModal visible onClose={jest.fn()} />)
    const textField = getByPlaceholderText('Development Code')
    await act(async () => {
      await fireEvent.changeText(textField, 'wirschaffendas')
    })
    expect(getByText(testCMS)).toBeDefined()
    const switchCMSButton = getByText(labels.settings.debugModal.changeCMS)
    expect(switchCMSButton).toBeDefined()
    await act(async () => {
      await fireEvent.press(switchCMSButton)
    })
    expect(getByText(productionCMS)).toBeDefined()
    await act(async () => {
      await fireEvent.press(switchCMSButton)
    })
    expect(getByText(testCMS)).toBeDefined()
  })
})
