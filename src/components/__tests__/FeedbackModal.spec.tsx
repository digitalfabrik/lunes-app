import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import render from '../../testing/render'
import FeedbackModal from '../FeedbackModal'

describe('FeedbackModal', () => {
  const onClose = jest.fn()

  it('should have a disabled send button when message is empty', () => {
    const { getByText, getByPlaceholderText } = render(<FeedbackModal visible onClose={onClose} />)
    expect(getByText(labels.feedback.sendFeedback)).toBeDisabled()
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    expect(getByText(labels.feedback.sendFeedback)).toBeEnabled()
    const submitButton = getByText(labels.feedback.sendFeedback)
    fireEvent.press(submitButton)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should get a cleared feedback text when clear button was clicked', () => {
    const { getByPlaceholderText, getByTestId } = render(<FeedbackModal visible onClose={onClose} />)
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.press(getByTestId('clearInput'))
    expect(feedbackInputField.props.value).toBe('')
  })

  it('should get cleared input fields after sending feedback', () => {
    const { getByText, getByPlaceholderText } = render(<FeedbackModal visible onClose={onClose} />)
    const feedbackInputField = getByPlaceholderText(labels.feedback.feedbackPlaceholder)
    const emailInputField = getByPlaceholderText(labels.feedback.mailPlaceholder)
    fireEvent.changeText(feedbackInputField, 'Mein Feedback')
    fireEvent.changeText(emailInputField, 'app-team@lunes.de')
    expect(getByText(labels.feedback.sendFeedback)).toBeEnabled()
    const submitButton = getByText(labels.feedback.sendFeedback)
    fireEvent.press(submitButton)
    expect(feedbackInputField.props.value).toBe('')
    expect(emailInputField.props.value).toBe('')
  })
})
