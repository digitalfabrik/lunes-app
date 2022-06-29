import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import render from '../../../../testing/render'
import DebugModal from '../DebugModal'

describe('DebugModal', () => {
  it('should show buttons only for correct text input', () => {
    const { queryByText, getByPlaceholderText } = render(<DebugModal visible onClose={jest.fn()} />)
    expect(queryByText(labels.settings.debugModal.sentry)).toBeNull()
    const textField = getByPlaceholderText('Development Code')
    fireEvent.changeText(textField, 'wirschaffendas')
    expect(queryByText(labels.settings.debugModal.sentry)).not.toBeNull()
  })
})
