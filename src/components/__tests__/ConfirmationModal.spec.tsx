import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import wrapWithTheme from '../../testing/wrapWithTheme'
import ConfirmationModal, { ConfirmationModalPropsType } from '../ConfirmationModal'

describe('Components', () => {
  describe('ConfirmationModal ', () => {
    const setVisible = jest.fn()
    const confirmationAction = jest.fn()

    const defaultModalProps: ConfirmationModalPropsType = {
      visible: false,
      setVisible: setVisible,
      text: 'Are you sure?',
      confirmationButtonText: 'confirm',
      cancelButtonText: 'cancel',
      confirmationAction: confirmationAction
    }

    it('should display passed props', () => {
      const { getByText } = render(<ConfirmationModal {...defaultModalProps} />, { wrapper: wrapWithTheme })
      expect(getByText('Are you sure?')).toBeDefined()
      expect(getByText('cancel')).toBeDefined()
      expect(getByText('confirm')).toBeDefined()
    })

    it('should close on cancel button click', () => {
      const { getByText } = render(<ConfirmationModal {...defaultModalProps} />, { wrapper: wrapWithTheme })
      const cancelButton = getByText('cancel')
      fireEvent.press(cancelButton)
      expect(setVisible).toBeCalledWith(false)
      expect(confirmationAction).not.toBeCalled()
    })

    it('should trigger action on confirm button click', () => {
      const { getByText } = render(<ConfirmationModal {...defaultModalProps} />, { wrapper: wrapWithTheme })
      const confirmationButton = getByText('confirm')
      fireEvent.press(confirmationButton)
      expect(confirmationAction).toBeCalled()
    })
  })
})
