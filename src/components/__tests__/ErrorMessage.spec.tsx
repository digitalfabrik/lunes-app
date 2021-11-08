import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import wrapWithTheme from '../../testing/wrapWithTheme'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  const refresh = jest.fn()

  it('should show NetworkError with refresh button', () => {
    const error: Error = new Error('Network Error')
    const { getByText } = render(<ErrorMessage error={error} refresh={refresh} />, { wrapper: wrapWithTheme })
    getByText(`${labels.general.error.noWifi} (Network Error)`)
    expect(getByText(labels.general.error.retryButton)).toBeDefined()
  })

  it('should call refresh function on button click', async () => {
    const error: Error = new Error('Network Error')
    const { getByText } = render(<ErrorMessage error={error} refresh={refresh} />, { wrapper: wrapWithTheme })
    const button = getByText(labels.general.error.retryButton)
    await fireEvent.press(button)
    expect(refresh).toBeCalled()
  })

  it('should show nothing if no error', () => {
    const { container } = render(<ErrorMessage error={null} refresh={refresh} />)
    expect(container).toBeEmpty()
  })

  it('should show message if other error', async () => {
    const error: Error = new Error('Other Error')
    const { getByText } = render(<ErrorMessage error={error} refresh={refresh} />, { wrapper: wrapWithTheme })
    expect(getByText('(Other Error)')).toBeDefined()
  })
})
