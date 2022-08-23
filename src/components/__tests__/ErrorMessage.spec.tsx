import { fireEvent, render as renderWithoutTheme } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import render from '../../testing/render'
import ErrorMessage from '../ErrorMessage'

describe('ErrorMessage', () => {
  const refresh = jest.fn()

  it('should show NetworkError with refresh button and image', () => {
    const error: Error = new Error('Network Error')
    const { getByText, getByTestId } = render(<ErrorMessage error={error} refresh={refresh} />)
    getByText(`${labels.general.error.noWifi} (Network Error)`)
    expect(getByTestId('no-internet-icon')).toBeDefined()
    expect(getByText(labels.general.error.retryButton)).toBeDefined()
  })

  it('should show reduced NetworkError in contained contexts', () => {
    const error: Error = new Error('Network Error')
    const { getByText, queryByTestId } = render(<ErrorMessage error={error} refresh={refresh} contained />)
    getByText(`${labels.general.error.noWifi} (Network Error)`)
    expect(queryByTestId('no-internet-icon')).toBeNull()
    expect(getByText(labels.general.error.retryButton)).toBeDefined()
  })

  it('should call refresh function on button click', async () => {
    const error: Error = new Error('Network Error')
    const { getByText } = render(<ErrorMessage error={error} refresh={refresh} />)
    const button = getByText(labels.general.error.retryButton)
    fireEvent.press(button)
    expect(refresh).toHaveBeenCalled()
  })

  it('should show nothing if no error', () => {
    const { container } = renderWithoutTheme(<ErrorMessage error={null} refresh={refresh} />)

    expect(container).toBeEmpty()
  })

  it('should show message if other error', () => {
    const error: Error = new Error('Other Error')
    const { getByText } = render(<ErrorMessage error={error} refresh={refresh} />)
    expect(getByText('Other Error')).toBeDefined()
  })
})
