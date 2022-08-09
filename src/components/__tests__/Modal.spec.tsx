import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import render from '../../testing/render'
import Modal, { ModalProps } from '../Modal'

describe('Modal', () => {
  const onClose = jest.fn()
  const confirmationAction = jest.fn()
  const childText = 'Children'

  const defaultModalProps: ModalProps = {
    visible: false,
    onClose,
    text: 'Are you sure?',
    children: <Text>{childText}</Text>,
    confirmationButtonText: 'confirm',
    confirmationAction,
  }

  it('should display passed props', () => {
    const { getByText } = render(<Modal {...defaultModalProps} />)
    expect(getByText('Are you sure?')).toBeDefined()
    expect(getByText('Zurück')).toBeDefined()
    expect(getByText('confirm')).toBeDefined()
  })

  it('should close on cancel button click', () => {
    const { getByText } = render(<Modal {...defaultModalProps} />)
    const cancelButton = getByText('Zurück')
    fireEvent.press(cancelButton)
    expect(onClose).toHaveBeenCalled()
    expect(confirmationAction).not.toHaveBeenCalled()
  })

  it('should trigger action on confirm button click', () => {
    const { getByText } = render(<Modal {...defaultModalProps} />)
    const confirmationButton = getByText('confirm')
    fireEvent.press(confirmationButton)
    expect(confirmationAction).toHaveBeenCalled()
  })

  it('should check for children if available', () => {
    const { getByText } = render(<Modal {...defaultModalProps} />)
    expect(getByText(childText)).toBeTruthy()
  })
})
