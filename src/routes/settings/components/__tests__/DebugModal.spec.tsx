import { act, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { localhostCMS, productionCMS, testCMS } from '../../../../services/axios'
import { getLabels } from '../../../../services/helpers'
import render from '../../../../testing/render'
import DebugModal from '../DebugModal'

describe('DebugModal', () => {
  it('should show buttons only for correct text input', async () => {
    const { queryByText, getByPlaceholderText } = render(<DebugModal isCodeRequired visible onClose={jest.fn()} />)
    expect(queryByText(getLabels().settings.debugModal.sentry)).toBeNull()
    const textField = getByPlaceholderText('Development Code')
    await act(async () => {
      fireEvent.changeText(textField, 'wirschaffendas')
    })
    expect(queryByText(getLabels().settings.debugModal.sentry)).not.toBeNull()
  })

  it('should show and switch cms url', async () => {
    const { getByText, getByPlaceholderText } = render(<DebugModal isCodeRequired visible onClose={jest.fn()} />)
    const textField = getByPlaceholderText('Development Code')
    await act(async () => {
      fireEvent.changeText(textField, 'wirschaffendas')
    })
    await waitFor(() => expect(getByText(testCMS)).toBeDefined())
    const switchCMSButton = getByText(getLabels().settings.debugModal.changeCMS)
    expect(switchCMSButton).toBeDefined()
    act(() => {
      fireEvent.press(switchCMSButton)
    })
    await waitFor(() => expect(getByText(productionCMS)).toBeDefined())
    act(() => {
      fireEvent.press(switchCMSButton)
    })
    await waitFor(() => expect(getByText(localhostCMS)).toBeDefined())
    act(() => {
      fireEvent.press(switchCMSButton)
    })
    await waitFor(() => expect(getByText(testCMS)).toBeDefined())
  })

  it('should show and toggle devmode status', async () => {
    const { queryByText, getByText, getByPlaceholderText } = render(
      <DebugModal isCodeRequired visible onClose={jest.fn()} />,
    )
    const textField = getByPlaceholderText('Development Code')

    await act(async () => {
      fireEvent.changeText(textField, 'wirschaffendas')
    })
    const enableDevModeButton = getByText(getLabels().settings.debugModal.enableDevMode)
    expect(enableDevModeButton).toBeDefined()

    await act(async () => {
      fireEvent.press(enableDevModeButton)
    })
    const disableDevModeButton = getByText(getLabels().settings.debugModal.disableDevMode)
    expect(disableDevModeButton).toBeDefined()

    const enableDevModeButtonAfterClick = queryByText(getLabels().settings.debugModal.enableDevMode)
    expect(enableDevModeButtonAfterClick).toBeNull()
  })
})
