import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import render from '../../testing/render'
import CustomModal, { CustomModalProps } from '../CustomModal'

describe('CustomModal', () => {
  const onClose = jest.fn()
  const confirmationAction = jest.fn()
  const childText = 'Children'

  const defaultModalProps: CustomModalProps = {
    visible: false,
    onClose,
    text: 'Are you sure?',
    children: <Text>{childText}</Text>,
    confirmationButtonText: 'confirm',
    confirmationAction
  }

  it('should display passed props', () => {
    const { getByText } = render(<CustomModal {...defaultModalProps} />)
    expect(getByText('Are you sure?')).toBeDefined()
    expect(getByText('Zurück')).toBeDefined()
    expect(getByText('confirm')).toBeDefined()
  })

  it('should close on cancel button click', () => {
    const { getByText } = render(<CustomModal {...defaultModalProps} />)
    const cancelButton = getByText('Zurück')
    fireEvent.press(cancelButton)
    expect(onClose).toHaveBeenCalled()
    expect(confirmationAction).not.toHaveBeenCalled()
  })

  it('should trigger action on confirm button click', () => {
    const { getByText } = render(<CustomModal {...defaultModalProps} />)
    const confirmationButton = getByText('confirm')
    fireEvent.press(confirmationButton)
    expect(confirmationAction).toHaveBeenCalled()
  })

  it('should check for children if available', () => {
    const { getByText } = render(<CustomModal {...defaultModalProps} />)
    expect(getByText(childText)).toBeTruthy()
  })
})
