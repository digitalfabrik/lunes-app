import { act, fireEvent, waitFor } from '@testing-library/react-native'
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
      fireEvent.changeText(textField, 'wirschaffendas')
    })
    await waitFor(() => expect(getByText(testCMS)).toBeDefined())
    const switchCMSButton = getByText(labels.settings.debugModal.changeCMS)
    expect(switchCMSButton).toBeDefined()
    act(() => {
      fireEvent.press(switchCMSButton)
    })
    await waitFor(() => expect(getByText(productionCMS)).toBeDefined())
    act(() => {
      fireEvent.press(switchCMSButton)
    })
    await waitFor(() => expect(getByText(testCMS)).toBeDefined())
  })

  it('should show and toggle devmode status', async () => {
    const { queryByText, getByText, getByPlaceholderText } = render(<DebugModal visible onClose={jest.fn()} />)
    const textField = getByPlaceholderText('Development Code')

    await act(async () => {
      fireEvent.changeText(textField, 'wirschaffendas')
    })
    const enableDevModeButton = getByText(labels.settings.debugModal.enableDevMode)
    expect(enableDevModeButton).toBeDefined()

    await act(async () => {
      fireEvent.press(enableDevModeButton)
    })
    const disableDevModeButton = getByText(labels.settings.debugModal.disableDevMode)
    expect(disableDevModeButton).toBeDefined()

    const enableDevModeButtonAfterClick = queryByText(labels.settings.debugModal.enableDevMode)
    expect(enableDevModeButtonAfterClick).toBeNull()
  })
})
