import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import ConfirmationModal, { ConfirmationModalProps } from '../ConfirmationModal'

describe('ConfirmationModal', () => {
  const onClose = jest.fn()
  const confirmationAction = jest.fn()

  const defaultModalProps: ConfirmationModalProps = {
    visible: false,
    onClose,
    text: 'Are you sure?',
    confirmationButtonText: 'confirm',
    cancelButtonText: 'cancel',
    confirmationAction
  }

  it('should display passed props', () => {
    const { getByText } = render(<ConfirmationModal {...defaultModalProps} />)
    expect(getByText('Are you sure?')).toBeDefined()
    expect(getByText('cancel')).toBeDefined()
    expect(getByText('confirm')).toBeDefined()
  })

  it('should close on cancel button click', () => {
    const { getByText } = render(<ConfirmationModal {...defaultModalProps} />)
    const cancelButton = getByText('cancel')
    fireEvent.press(cancelButton)
    expect(onClose).toHaveBeenCalled()
    expect(confirmationAction).not.toHaveBeenCalled()
  })

  it('should trigger action on confirm button click', () => {
    const { getByText } = render(<ConfirmationModal {...defaultModalProps} />)
    const confirmationButton = getByText('confirm')
    fireEvent.press(confirmationButton)
    expect(confirmationAction).toHaveBeenCalled()
  })
})
