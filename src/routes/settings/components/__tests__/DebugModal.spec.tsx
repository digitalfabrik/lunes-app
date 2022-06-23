import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import render from '../../../../testing/render'
import DebugModal from '../DebugModal'

describe('DebugModal', () => {
  it('should show buttons only for correct text input', () => {
    const { queryByText, getByTestId } = render(<DebugModal visible onClose={jest.fn()} />)
    expect(queryByText(labels.settings.debugModal.sentry)).toBeNull()
    const textField = getByTestId('code-input')
    fireEvent.changeText(textField, 'wirschaffendas')
    expect(queryByText(labels.settings.debugModal.sentry)).not.toBeNull()
  })
})
